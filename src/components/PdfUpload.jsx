import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseResultPDF } from '../utils/pdfParser';

/**
 * PDF Upload component for RTU result marksheets.
 * Supports drag-and-drop and click-to-browse.
 * Parses the PDF and returns extracted grades.
 * 
 * @param {{ onGradesExtracted: Function, subjects: Array }} props
 */
export default function PdfUpload({ onGradesExtracted, subjects }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    
    setFileName(file.name);
    setIsProcessing(true);
    setResult(null);

    try {
      const parsed = await parseResultPDF(file);
      setResult(parsed);

      if (parsed.success && parsed.grades.length > 0) {
        // Map parsed grades to subject codes
        const gradeMap = {};
        let matchedCount = 0;
        let unmatchedCodes = [];
        
        // Find Foundation Course subject in current semester (code ending with -FC)
        const foundationSubject = subjects.find(s => s.code.endsWith('-FC'));
        
        for (const { courseCode, grade } of parsed.grades) {
          // Direct match with subjects
          const matchedSubject = subjects.find(s => s.code === courseCode);
          if (matchedSubject) {
            gradeMap[courseCode] = grade;
            matchedCount++;
          } else if (/^FEC\d{2}$/i.test(courseCode) && foundationSubject) {
            // FEC codes (FEC02, FEC04, etc.) map to Foundation Course
            gradeMap[foundationSubject.code] = grade;
            matchedCount++;
          } else {
            unmatchedCodes.push(courseCode);
          }
        }

        if (matchedCount > 0) {
          onGradesExtracted(gradeMap, {
            matchedCount,
            totalExtracted: parsed.grades.length,
            unmatchedCodes,
            studentInfo: parsed.studentInfo,
            semester: parsed.semester,
          });
        }
      }
    } catch (err) {
      setResult({
        success: false,
        error: 'An unexpected error occurred while processing the PDF.',
        grades: [],
      });
    } finally {
      setIsProcessing(false);
    }
  }, [subjects, onGradesExtracted]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleReset = () => {
    setResult(null);
    setFileName('');
    setIsProcessing(false);
  };

  return (
    <div className="space-y-4" id="pdf-upload-section">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/30 shadow-lg shadow-indigo-500/20'
            : result?.success
            ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20'
            : result?.error
            ? 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!isProcessing ? handleClick : undefined}
        whileHover={!isProcessing ? { scale: 1.005 } : {}}
        whileTap={!isProcessing ? { scale: 0.995 } : {}}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleInputChange}
          className="hidden"
          id="pdf-file-input"
        />

        <div className="relative px-6 py-8 sm:px-8 sm:py-10 flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-4"
              >
                {/* Spinning loader */}
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-indigo-200 dark:border-indigo-800" />
                  <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">📄</div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    Processing PDF...
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Extracting grades from <span className="font-medium">{fileName}</span>
                  </p>
                </div>
              </motion.div>
            ) : result?.success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-3"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-500/30"
                >
                  ✓
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Grades extracted successfully!
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {fileName}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline underline-offset-2 transition-colors"
                >
                  Upload another PDF
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <motion.div
                  animate={{ y: isDragging ? -8 : 0 }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                  className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/30"
                >
                  📄
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {isDragging ? 'Drop your PDF here!' : 'Upload RTU Result PDF'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Drag & drop your marksheet or <span className="text-indigo-600 dark:text-indigo-400 font-medium">click to browse</span>
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                    📋 Auto-fill grades
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                    🔒 100% client-side
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Result Details */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {result.success ? (
              <div className="space-y-3">
                {/* Student Info Card */}
                {result.studentInfo?.name && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base">👤</span>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Student Info</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {result.studentInfo.name && (
                        <div>
                          <span className="text-gray-400 dark:text-gray-500">Name</span>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{result.studentInfo.name}</p>
                        </div>
                      )}
                      {result.studentInfo.rollNo && (
                        <div>
                          <span className="text-gray-400 dark:text-gray-500">Roll No</span>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{result.studentInfo.rollNo}</p>
                        </div>
                      )}
                      {result.studentInfo.enrollmentNo && (
                        <div>
                          <span className="text-gray-400 dark:text-gray-500">Enrollment No</span>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{result.studentInfo.enrollmentNo}</p>
                        </div>
                      )}
                      {result.studentInfo.fatherName && (
                        <div>
                          <span className="text-gray-400 dark:text-gray-500">Father&apos;s Name</span>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{result.studentInfo.fatherName}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Extracted Grades Summary */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">✅</span>
                      <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                        {result.grades.length} grades extracted
                      </h4>
                    </div>
                    {result.semester && (
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                        Semester {result.semester}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.grades.map(({ courseCode, grade }) => {
                      const directMatch = subjects.find(s => s.code === courseCode);
                      const fcSubject = subjects.find(s => s.code.endsWith('-FC'));
                      const isFecCode = /^FEC\d{2}$/i.test(courseCode);
                      const matched = directMatch || (isFecCode && fcSubject);
                      const displayName = directMatch
                        ? directMatch.name
                        : (isFecCode && fcSubject)
                        ? `${fcSubject.name} (${courseCode} → ${fcSubject.code})`
                        : `${courseCode} not in current semester`;
                      return (
                        <span
                          key={courseCode}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                            matched
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-gray-100 dark:bg-gray-700/30 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 line-through'
                          }`}
                          title={displayName}
                        >
                          <span className="font-mono">{courseCode}</span>
                          <span className="font-bold">{grade}</span>
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            ) : result.error ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/20 p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">❌</span>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">{result.error}</p>
                </div>
                <button
                  onClick={handleReset}
                  className="mt-3 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline underline-offset-2 transition-colors"
                >
                  Try again
                </button>
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
