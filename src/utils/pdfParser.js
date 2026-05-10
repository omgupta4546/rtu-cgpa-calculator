/**
 * RTU Result PDF Parser
 * 
 * Extracts grades from RTU result PDF marksheets.
 * Uses pdfjs-dist for client-side PDF text extraction.
 * 
 * RTU PDF format (from screenshot):
 * - Header: RAJASTHAN TECHNICAL UNIVERSITY KOTA
 * - Exam info: B. Tech II SEM MAIN EXAM 2025 (GRADING)
 * - Table columns: COURSE TITLE | COURSE CODE | MARKS1(MIDTERM) | MARKS2(ENDTERM) | GRADE
 * - Course codes like: 2FY1-04, 2FY2-01, 3EC4-04, etc.
 * - Grades: A++, A+, A, B+, B, C+, C, D+, D, E+, E, F
 */

import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set the worker source for pdf.js (Vite-compatible ?url import)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

// Valid RTU grades
const VALID_GRADES = ['A++', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E+', 'E', 'F'];

// Course code pattern: like 1FY2-01, 2FY3-06, 3EC4-04, 4EI4-21, FEC04, etc.
const COURSE_CODE_PATTERN = /\b(\d[A-Z]{2}\d-\d{2})\b/;
const SPECIAL_CODE_PATTERN = /\b(FEC\d{2})\b/;

/**
 * Extract all text content from a PDF file.
 * @param {File|ArrayBuffer} pdfSource - PDF file or ArrayBuffer
 * @returns {Promise<string[]>} Array of text lines from the PDF
 */
async function extractTextFromPDF(pdfSource) {
  let arrayBuffer;
  
  if (pdfSource instanceof File) {
    arrayBuffer = await pdfSource.arrayBuffer();
  } else {
    arrayBuffer = pdfSource;
  }

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const allLines = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Group text items by their Y position (same line)
    const lineMap = new Map();
    
    for (const item of textContent.items) {
      if (!item.str || item.str.trim() === '') continue;
      
      // Round Y position to group items on the same line
      const y = Math.round(item.transform[5]);
      
      if (!lineMap.has(y)) {
        lineMap.set(y, []);
      }
      lineMap.get(y).push({
        text: item.str.trim(),
        x: item.transform[4], // X position for ordering
      });
    }
    
    // Sort lines by Y position (top to bottom = descending Y)
    const sortedYPositions = [...lineMap.keys()].sort((a, b) => b - a);
    
    for (const y of sortedYPositions) {
      const items = lineMap.get(y);
      // Sort items left to right by X position
      items.sort((a, b) => a.x - b.x);
      const lineText = items.map(item => item.text).join(' ');
      allLines.push(lineText);
    }
  }

  return allLines;
}

/**
 * Detect semester number from the PDF text.
 * Looks for patterns like "II SEM", "III SEM", "I SEM", etc.
 * @param {string[]} lines - Text lines from PDF
 * @returns {number|null} Semester number or null
 */
function detectSemester(lines) {
  const romanToNum = {
    'VIII': 8, 'VII': 7, 'VI': 6, 'V': 5,
    'IV': 4, 'III': 3, 'II': 2, 'I': 1,
  };

  for (const line of lines) {
    // Match patterns like "II SEM", "III Sem", "I SEM"
    const match = line.match(/\b(VIII|VII|VI|V|IV|III|II|I)\s*SEM/i);
    if (match) {
      return romanToNum[match[1].toUpperCase()] || null;
    }
    // Also check for "2nd Sem", "3rd Sem" style
    const numMatch = line.match(/\b(\d)\s*(st|nd|rd|th)\s*SEM/i);
    if (numMatch) {
      return parseInt(numMatch[1]);
    }
  }
  return null;
}

/**
 * Detect branch from course codes.
 * Sem 1-2 codes are like xFYy-zz (common/First Year)
 * Sem 3+ codes indicate branch: EC = ECE, EI = EIC
 * @param {string[]} courseCodes - Extracted course codes
 * @returns {string|null} Branch code or null
 */
function detectBranch(courseCodes) {
  for (const code of courseCodes) {
    // Check for branch-specific codes (semester 3+)
    if (/\dEC\d/.test(code)) return 'ECE';
    if (/\dEI\d/.test(code)) return 'EIC';
  }
  // If all codes are FY (first year), it's common for sem 1/2
  return null;
}

/**
 * Extract student info from PDF text.
 * @param {string[]} lines - Text lines
 * @returns {{ name: string, rollNo: string, enrollmentNo: string, fatherName: string }}
 */
function extractStudentInfo(lines) {
  const info = {
    name: '',
    rollNo: '',
    enrollmentNo: '',
    fatherName: '',
  };

  for (const line of lines) {
    // Roll No
    const rollMatch = line.match(/Roll\s*No\s*:?\s*(\S+)/i);
    if (rollMatch) info.rollNo = rollMatch[1];
    
    // Enrollment No
    const enrollMatch = line.match(/Enrollment\s*No\s*:?\s*(\S+)/i);
    if (enrollMatch) info.enrollmentNo = enrollMatch[1];
    
    // Name (look for "Name :" pattern, but not "Father's Name")
    const nameMatch = line.match(/^Name\s*:?\s*(.+)/i);
    if (nameMatch && !line.match(/Father/i)) {
      // Clean up - remove Father's Name portion if on same line
      let name = nameMatch[1].trim();
      const fatherIdx = name.indexOf("Father's");
      if (fatherIdx > -1) name = name.substring(0, fatherIdx).trim();
      info.name = name;
    }
    
    // Father's Name
    const fatherMatch = line.match(/Father'?s?\s*Name\s*:?\s*(.+)/i);
    if (fatherMatch) info.fatherName = fatherMatch[1].trim();
  }

  return info;
}

/**
 * Parse course codes and grades from PDF text lines.
 * 
 * RTU format: each row has COURSE TITLE, COURSE CODE, MARKS, GRADE
 * Grade is always the last meaningful token on a line that contains a course code.
 * 
 * @param {string[]} lines - Text lines from PDF
 * @returns {Array<{ courseCode: string, grade: string }>}
 */
function extractGrades(lines) {
  const results = [];
  
  for (const line of lines) {
    // Try to find a course code in this line
    const codeMatch = line.match(COURSE_CODE_PATTERN);
    const specialMatch = line.match(SPECIAL_CODE_PATTERN);
    
    const courseCode = codeMatch ? codeMatch[1] : (specialMatch ? specialMatch[1] : null);
    
    if (!courseCode) continue;
    
    // Find the grade - look for valid grade at the end of the line
    // Split the line and check tokens from the end
    const tokens = line.split(/\s+/);
    
    let grade = null;
    
    // Check last few tokens for a valid grade
    for (let i = tokens.length - 1; i >= 0 && i >= tokens.length - 3; i--) {
      const token = tokens[i];
      
      // Check for compound grades like A++ that might be split
      if (i > 0) {
        const compound = tokens[i - 1] + token;
        if (VALID_GRADES.includes(compound)) {
          grade = compound;
          break;
        }
      }
      
      if (VALID_GRADES.includes(token)) {
        grade = token;
        break;
      }
    }
    
    if (grade) {
      results.push({ courseCode, grade });
    }
  }
  
  return results;
}

/**
 * Main function: Parse an RTU result PDF and extract all relevant data.
 * 
 * @param {File} pdfFile - The PDF file to parse
 * @returns {Promise<{
 *   success: boolean,
 *   semester: number|null,
 *   branch: string|null,
 *   studentInfo: Object,
 *   grades: Array<{ courseCode: string, grade: string }>,
 *   rawText: string[],
 *   error: string|null
 * }>}
 */
export async function parseResultPDF(pdfFile) {
  try {
    // Validate file type
    if (pdfFile.type && pdfFile.type !== 'application/pdf') {
      return {
        success: false,
        semester: null,
        branch: null,
        studentInfo: {},
        grades: [],
        rawText: [],
        error: 'Please upload a valid PDF file.',
      };
    }

    const lines = await extractTextFromPDF(pdfFile);
    
    if (lines.length === 0) {
      return {
        success: false,
        semester: null,
        branch: null,
        studentInfo: {},
        grades: [],
        rawText: lines,
        error: 'Could not extract text from PDF. The file may be image-based or corrupted.',
      };
    }

    const semester = detectSemester(lines);
    const gradeEntries = extractGrades(lines);
    const courseCodes = gradeEntries.map(g => g.courseCode);
    const branch = detectBranch(courseCodes);
    const studentInfo = extractStudentInfo(lines);

    if (gradeEntries.length === 0) {
      return {
        success: false,
        semester,
        branch,
        studentInfo,
        grades: [],
        rawText: lines,
        error: 'No grades found in the PDF. Please make sure this is an RTU result PDF.',
      };
    }

    return {
      success: true,
      semester,
      branch,
      studentInfo,
      grades: gradeEntries,
      rawText: lines,
      error: null,
    };
  } catch (err) {
    console.error('PDF parsing error:', err);
    return {
      success: false,
      semester: null,
      branch: null,
      studentInfo: {},
      grades: [],
      rawText: [],
      error: `Failed to parse PDF: ${err.message}`,
    };
  }
}
