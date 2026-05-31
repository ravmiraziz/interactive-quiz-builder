export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  number?: number; // original index or question number
}

export type QuizStatus = 'idle' | 'playing' | 'paused' | 'completed';

export interface QuizSettings {
  timeLimitPerQuestion: number; // in seconds, 0 means no limit
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  passingScore: number; // e.g. 60 for 60%
  questionMode?: 'all' | 'subset';
  subsetCount?: number;
  subsetOrder?: 'sequential' | 'random';
  solvingTemplate?: 'slide' | 'scroll'; // slide/classic or scroll/list
  chunkMode?: boolean; // enable solving in customized sequential blocks
  activeChunkIndex?: number; // 0-based chunk/block index
}

export interface QuizState {
  status: QuizStatus;
  questions: Question[];
  currentQuestionIndex: number;
  userResponses: { [questionId: string]: string }; // maps question.id -> selected option text
  timeSpent: { [questionId: string]: number }; // maps question.id -> seconds spent
  totalElapsedTime: number; // overall seconds elapsed
  settings: QuizSettings;
}

export interface ParserResult {
  success: boolean;
  questions: Question[];
  error?: string;
  fileName: string;
  fileSize: number;
  format: 'xlsx' | 'docx';
}
