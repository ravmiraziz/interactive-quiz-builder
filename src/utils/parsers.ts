import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { Question, ParserResult } from '../types/quiz';

/**
 * Formats file size to a human-readable string.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Parses questions from an uploaded XLSX file.
 */
export async function parseXLSX(file: File): Promise<ParserResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to JSON rows
        const rows = XLSX.utils.sheet_to_json<any>(worksheet);
        
        if (!rows || rows.length === 0) {
          resolve({
            success: false,
            questions: [],
            error: 'The uploaded Excel file appears to have no data rows.',
            fileName: file.name,
            fileSize: file.size,
            format: 'xlsx'
          });
          return;
        }

        const questions: Question[] = [];
        const headers = Object.keys(rows[0]);

        // 1. Identify the Question Column
        // Look for common terms: "savol", "vo'pro's", "vopros", "question", "text", "body", "issue"
        let questionKey = headers.find(h => {
          const lh = h.toLowerCase();
          return lh.includes('savol') || lh.includes('вопрос') || lh.includes('question') || lh.includes('text');
        });

        // 2. Identify Options Columns and the correct answer column
        // In the native format:
        // Column A: №
        // Column B: Savol/Вопрос
        // Column C: To'gri javob A
        // Column D: no'gri javob B
        // Column E: no'gri javob C
        // Column F: no'gri javob D
        
        let correctHeader = headers.find(h => {
          const lh = h.toLowerCase();
          return lh.includes('to\'g\'ri') || lh.includes('to\'gri') || lh.includes('to’g’ri') || lh.includes('to’gri') || lh.includes('togri') || lh.includes('correct');
        });

        const optionAHeader = correctHeader || headers.find(h => {
          const lh = h.toLowerCase();
          return lh === 'optiona' || lh === 'option_a' || lh === 'option a' || lh === 'a';
        });

        const optionBHeader = headers.find(h => {
          const lh = h.toLowerCase();
          return lh.includes('no\'g\'ri') || lh.includes('no\'gri') || lh.includes('no’g’ri') || lh.includes('no’gri') || lh.includes('nogri') || lh.includes('incorrect') || lh === 'optionb' || lh === 'option b' || lh === 'b';
        });

        const optionCHeader = headers.find(h => {
          const lh = h.toLowerCase();
          return lh.includes('no\'g\'ri javob c') || lh.includes('no\'gri javob c') || lh.includes('no’g’ri javob c') || lh.includes('no’gri javob c') || lh.includes('nogri javob c') || lh.includes('incorrect c') || lh === 'optionc' || lh === 'option c' || lh === 'c';
        });

        const optionDHeader = headers.find(h => {
          const lh = h.toLowerCase();
          return lh.includes('no\'g\'ri javob d') || lh.includes('no\'gri javob d') || lh.includes('no’g’ri javob d') || lh.includes('no’gri javob d') || lh.includes('nogri javob d') || lh.includes('incorrect d') || lh === 'optiond' || lh === 'option d' || lh === 'd';
        });

        // Resolve placeholders or fallbacks by literal column index positions if headers are customized
        const qKey = questionKey || headers[1] || headers[0];
        const optAKey = optionAHeader || headers[2];
        const optBKey = optionBHeader || headers[3];
        const optCKey = optionCHeader || headers[4];
        const optDKey = optionDHeader || headers[5];

        // Explanations/Comments if any
        const explanationHeader = headers.find(h => {
          const lh = h.toLowerCase();
          return lh.includes('explanation') || lh.includes('izoh') || lh.includes('tushuntirish') || lh.includes('comment');
        });

        // Separate CorrectAnswer column (if Excel uses general OptionA-D with a dedicated CorrectAnswer column rather than having 'Correct' column natively)
        const correctAnswerHeader = headers.find(h => {
          const lh = h.toLowerCase();
          return (lh.includes('correctanswer') || lh.includes('correct_answer') || lh === 'correct_answer' || lh === 'javob') && h !== correctHeader;
        });

        rows.forEach((row, index) => {
          const questionText = row[qKey]?.toString().trim();
          if (!questionText) return; // ignore completely blank rows

          const optAVal = row[optAKey]?.toString().trim() || '';
          const optBVal = row[optBKey]?.toString().trim() || '';
          const optCVal = row[optCKey]?.toString().trim() || '';
          const optDVal = row[optDKey]?.toString().trim() || '';

          // Filter out empty choices
          const options = [optAVal, optBVal, optCVal, optDVal].filter(opt => opt !== '');
          if (options.length < 2) return; // Needs at least 2 options to construct a trivia question

          let correctAnswerText = optAVal; // default to column A (Uzbek style correct key)

          if (correctAnswerHeader && row[correctAnswerHeader]) {
            const rawAns = row[correctAnswerHeader].toString().trim();
            const cleanLetter = rawAns.toUpperCase();
            if (cleanLetter === 'A' || cleanLetter === '1') correctAnswerText = optAVal;
            else if (cleanLetter === 'B' || cleanLetter === '2') correctAnswerText = optBVal;
            else if (cleanLetter === 'C' || cleanLetter === '3') correctAnswerText = optCVal;
            else if (cleanLetter === 'D' || cleanLetter === '4') correctAnswerText = optDVal;
            else {
              // Compare directly with string options
              const matchedStr = options.find(o => o.toLowerCase() === rawAns.toLowerCase());
              if (matchedStr) correctAnswerText = matchedStr;
              else correctAnswerText = rawAns; // Raw match
            }
          }

          const qNumStr = row[headers[0]]?.toString().trim();
          const qNumber = qNumStr ? parseInt(qNumStr, 10) : (index + 1);

          questions.push({
            id: `xlsx-q-${index}-${Date.now()}`,
            questionText,
            options,
            correctAnswer: correctAnswerText,
            explanation: explanationHeader ? row[explanationHeader]?.toString().trim() : undefined,
            number: isNaN(qNumber) ? index + 1 : qNumber
          });
        });

        if (questions.length === 0) {
          resolve({
            success: false,
            questions: [],
            error: 'No valid questions could be formulated. Verify Excel column structure (Question, Option A, Option B...).',
            fileName: file.name,
            fileSize: file.size,
            format: 'xlsx'
          });
          return;
        }

        resolve({
          success: true,
          questions,
          fileName: file.name,
          fileSize: file.size,
          format: 'xlsx'
        });

      } catch (err: any) {
        resolve({
          success: false,
          questions: [],
          error: `Error parsing Excel: ${err.message || 'Malformed sheet structures.'}`,
          fileName: file.name,
          fileSize: file.size,
          format: 'xlsx'
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        questions: [],
        error: 'Unable to read file contents.',
        fileName: file.name,
        fileSize: file.size,
        format: 'xlsx'
      });
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parses questions from an uploaded DOCX file.
 */
export async function parseDOCX(file: File): Promise<ParserResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        // Extract raw unicode text from docx via mammoth
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;

        if (!text || text.trim().length === 0) {
          resolve({
            success: false,
            questions: [],
            error: 'The Word file is blank or contains no legible text characters.',
            fileName: file.name,
            fileSize: file.size,
            format: 'docx'
          });
          return;
        }

        const questions: Question[] = [];

        // Check if there are signs of double equal and plus block format (++++ and ====)
        const isBlockFormat = text.includes('++++') || text.includes('====');

        if (isBlockFormat) {
          // Block format parsing (separated by +++++)
          const blocks = text.split(/\s*\+{3,}\s*/g);
          
          blocks.forEach((block) => {
            const trimmedBlock = block.trim();
            if (!trimmedBlock) return;

            // Split the block into question text and options by =====
            const parts = trimmedBlock.split(/\s*={3,}\s*/g);
            if (parts.length < 2) return; // Needs at least question text and an option

            const questionText = parts[0].trim();
            if (!questionText) return;

            const currentOptions: string[] = [];
            let correctOption: string | null = null;

            for (let pIdx = 1; pIdx < parts.length; pIdx++) {
              const rawOpt = parts[pIdx].trim();
              if (!rawOpt) continue;

              let isCorrect = false;
              let cleanOpt = rawOpt;

              if (rawOpt.startsWith('#')) {
                isCorrect = true;
                cleanOpt = rawOpt.slice(1).trim();
              } else if (rawOpt.startsWith('*')) {
                isCorrect = true;
                cleanOpt = rawOpt.slice(1).trim();
              } else if (rawOpt.toLowerCase().startsWith('correct:')) {
                isCorrect = true;
                cleanOpt = rawOpt.slice(8).trim();
              }

              currentOptions.push(cleanOpt);
              if (isCorrect) {
                correctOption = cleanOpt;
              }
            }

            if (currentOptions.length < 1) return;

            // Default correct option to first if none marked
            const matchedCorrect = correctOption || currentOptions[0];

            questions.push({
              id: `docx-block-q-${questions.length}-${Date.now()}`,
              questionText,
              options: currentOptions,
              correctAnswer: matchedCorrect,
              number: questions.length + 1
            });
          });
        } else {
          // Standard List-based parsing (numbered with letters)
          const rawLines = text.split(/\r?\n/);

          // Transient state variables for parser engine
          let currentNumber: number | undefined = undefined;
          let currentQuestionText = '';
          let currentOptions: string[] = [];
          let currentCorrectAnswer = '';
          let pendingCorrectLetter = ''; // A-Z letter specified in "Answer: B"
          let currentExplanation = '';
          let parsingState: 'none' | 'question' | 'options' | 'explanation' = 'none';

          // Regex patterns
          const questionStartRegex = /^\s*(\d+)[\.\)\-\/\s]+\s*(.*)$/;
          const optionRegex = /^\s*\*?\s*([a-hA-H])[\.\)\-\/\s]\s*(.*)$/;
          const answerRegex = /^\s*(?:Answer|Javob|To'g'ri javob|Vopros|Correct)\s*:\s*([a-hA-H])\s*$/i;
          const explanationRegex = /^\s*(?:Explanation|Izoh|Tushuntirish|Comment|Note)\s*:\s*(.*)$/i;

          const commitQuestion = () => {
            if (!currentQuestionText.trim()) return;
            if (currentOptions.length < 2) return; // Need minimal options choices

            let matchedCorrect = currentCorrectAnswer;
            if (!matchedCorrect && pendingCorrectLetter) {
              const index = pendingCorrectLetter.toUpperCase().charCodeAt(0) - 65; // A -> 0, B -> 1
              if (index >= 0 && index < currentOptions.length) {
                matchedCorrect = currentOptions[index];
              }
            }

            // If STILL not highlighted, fallback to Option A (index 0)
            if (!matchedCorrect) {
              matchedCorrect = currentOptions[0];
            }

            questions.push({
              id: `docx-q-${questions.length}-${Date.now()}`,
              questionText: currentQuestionText.trim(),
              options: [...currentOptions],
              correctAnswer: matchedCorrect,
              explanation: currentExplanation.trim() ? currentExplanation.trim() : undefined,
              number: currentNumber || (questions.length + 1)
            });

            // Reset transient states
            currentQuestionText = '';
            currentOptions = [];
            currentCorrectAnswer = '';
            pendingCorrectLetter = '';
            currentExplanation = '';
          };

          for (let i = 0; i < rawLines.length; i++) {
            const line = rawLines[i].trim();
            if (!line) continue; // Skip blank layout whitespace lines

            // Check if it's the start of a new question
            const qMatch = line.match(questionStartRegex);
            const isAnotherQ = qMatch && !line.match(optionRegex); // prefix digit might look like option if options are numbered, but checking optionRegex excludes them

            if (isAnotherQ) {
              // Commit previous question
              commitQuestion();

              currentNumber = parseInt(qMatch[1], 10);
              currentQuestionText = qMatch[2] || '';
              parsingState = 'question';
              continue;
            }

            // Check if it matches option syntax (e.g. "a) Predmeti", "b) *Vazifasi")
            const optMatch = line.match(optionRegex);
            if (optMatch) {
              parsingState = 'options';
              const optionLetter = optMatch[1].toUpperCase();
              const optionTextRaw = optMatch[2] || '';
              
              let optionClean = optionTextRaw.trim();
              let isCorrectMarked = false;

              // Detect star * prefix either in the whole line start or right inside option text:
              // "c) *Maqsadi" or "*c) Option text"
              if (line.includes('*') || optionTextRaw.startsWith('*')) {
                isCorrectMarked = true;
                // Strip any remaining asterisks
                optionClean = optionClean.replace(/^\*+/, '').trim();
              }

              if (optionClean) {
                currentOptions.push(optionClean);
                if (isCorrectMarked) {
                  currentCorrectAnswer = optionClean;
                }
              }
              continue;
            }

            // Check if it matches dedicated trailing answers block e.g. "Answer: B"
            const ansMatch = line.match(answerRegex);
            if (ansMatch) {
              pendingCorrectLetter = ansMatch[1];
              continue;
            }

            // Check for explanation lines
            const expMatch = line.match(explanationRegex);
            if (expMatch) {
              parsingState = 'explanation';
              currentExplanation = expMatch[1] || '';
              continue;
            }

            // Handle multi-line textual items or comments
            if (parsingState === 'question') {
              currentQuestionText += ' ' + line;
            } else if (parsingState === 'explanation') {
              currentExplanation += ' ' + line;
            }
          }

          // Commit final buffered question
          commitQuestion();
        }

        if (questions.length === 0) {
          resolve({
            success: false,
            questions: [],
            error: 'Failed to extract structures. Make sure questions start with a number (e.g., "1. What is...") and choices use letters (e.g., "a) Predmeti"). Correct choices should contain an asterisk ("*"), or use the classic "++++"/"====" template with "#" answer prefixes.',
            fileName: file.name,
            fileSize: file.size,
            format: 'docx'
          });
          return;
        }

        resolve({
          success: true,
          questions,
          fileName: file.name,
          fileSize: file.size,
          format: 'docx'
        });

      } catch (err: any) {
        resolve({
          success: false,
          questions: [],
          error: `Error parsing DOCX file: ${err.message || 'Invalid word docx.'}`,
          fileName: file.name,
          fileSize: file.size,
          format: 'docx'
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        questions: [],
        error: 'Unable to stream file contents into memory.',
        fileName: file.name,
        fileSize: file.size,
        format: 'docx'
      });
    };

    reader.readAsArrayBuffer(file);
  });
}
