import { useState, useEffect, useCallback, useRef } from 'react';
import { Question, QuizState, QuizStatus, QuizSettings } from '../types/quiz';

const DEFAULT_SETTINGS: QuizSettings = {
  timeLimitPerQuestion: 0, // 0 means unlimited
  shuffleQuestions: false,
  shuffleOptions: true,
  passingScore: 60,
  showImmediateFeedback: false,
  autoAdvance: false,
};

const INITIAL_STATE: QuizState = {
  status: 'idle',
  questions: [],
  currentQuestionIndex: 0,
  userResponses: {},
  timeSpent: {},
  totalElapsedTime: 0,
  settings: DEFAULT_SETTINGS,
};

export function useQuiz() {
  const [state, setState] = useState<QuizState>(() => {
    // attempt loading quiz state from localstorage if page is accidentally reloaded
    try {
      const saved = localStorage.getItem('interactive_quiz_builder_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        // resume if was mid-quiz, otherwise default
        if (parsed.status === 'playing' || parsed.status === 'paused') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_STATE;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('interactive_quiz_builder_state', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  // Handle countdown/timer tick
  useEffect(() => {
    if (state.status === 'playing') {
      timerRef.current = setInterval(() => {
        setState((prev) => {
          const currentQuestionId = prev.questions[prev.currentQuestionIndex]?.id;
          if (!currentQuestionId) return prev;

          // Compute new time spent on current question
          const currentSpent = prev.timeSpent[currentQuestionId] || 0;
          const limit = prev.settings.timeLimitPerQuestion;
          
          // Auto submission if time limit is reached
          if (limit > 0 && currentSpent >= limit - 1) {
            // Time limit reached! Trigger autoadvance
            const isLast = prev.currentQuestionIndex === prev.questions.length - 1;
            const updatedResponses = {
              ...prev.userResponses,
              [currentQuestionId]: prev.userResponses[currentQuestionId] || '[TIMED OUT]'
            };
            const updatedTimeSpent = {
              ...prev.timeSpent,
              [currentQuestionId]: limit
            };

            return {
              ...prev,
              userResponses: updatedResponses,
              timeSpent: updatedTimeSpent,
              currentQuestionIndex: isLast ? prev.currentQuestionIndex : prev.currentQuestionIndex + 1,
              status: isLast ? 'completed' : 'playing',
              totalElapsedTime: prev.totalElapsedTime + 1
            };
          }

          // Normal tick
          return {
            ...prev,
            totalElapsedTime: prev.totalElapsedTime + 1,
            timeSpent: {
              ...prev.timeSpent,
              [currentQuestionId]: currentSpent + 1
            }
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.status, state.currentQuestionIndex, state.settings.timeLimitPerQuestion]);

  // Helper code to shuffle items in local memory
  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  /**
   * Starts a dynamic quiz session.
   */
  const startQuiz = useCallback((rawQuestions: Question[], customSettings?: Partial<QuizSettings>) => {
    const activeSettings: QuizSettings = {
      ...DEFAULT_SETTINGS,
      ...customSettings,
    };

    let subsetPool = [...rawQuestions];

    // Crop or pick subset of questions
    if (activeSettings.questionMode === 'subset' && activeSettings.subsetCount && activeSettings.subsetCount > 0) {
      const targetCount = activeSettings.subsetCount;
      if (activeSettings.chunkMode || (activeSettings.activeChunkIndex !== undefined && activeSettings.activeChunkIndex > 0)) {
        const chunkIdx = activeSettings.activeChunkIndex || 0;
        const start = chunkIdx * targetCount;
        const end = start + targetCount;
        subsetPool = subsetPool.slice(start, end);
      } else if (activeSettings.subsetOrder === 'random') {
        subsetPool = shuffle(subsetPool).slice(0, targetCount);
      } else {
        subsetPool = subsetPool.slice(0, targetCount);
      }
    }

    // Now, if they wanted questions in this active subset shuffled:
    if (activeSettings.shuffleQuestions && activeSettings.subsetOrder !== 'random') {
      subsetPool = shuffle(subsetPool);
    } else if (activeSettings.shuffleQuestions && activeSettings.questionMode !== 'subset') {
      subsetPool = shuffle(subsetPool);
    }

    // Process each selected question (shuffle options etc)
    const processedQuestions = subsetPool.map((q) => {
      let finalOptions = [...q.options];
      if (activeSettings.shuffleOptions) {
        finalOptions = shuffle(finalOptions);
      }
      return {
        ...q,
        options: finalOptions
      };
    });

    setState({
      status: 'playing',
      questions: processedQuestions,
      currentQuestionIndex: 0,
      userResponses: {},
      timeSpent: {},
      totalElapsedTime: 0,
      settings: activeSettings,
    });
  }, []);

  /**
   * Resets entire session and returns back to dashboard.
   */
  const resetQuiz = useCallback(() => {
    setState(INITIAL_STATE);
    try {
      localStorage.removeItem('interactive_quiz_builder_state');
    } catch {
      // ignore
    }
  }, []);

  /**
   * Pauses the timer clock.
   */
  const pauseQuiz = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev;
      return { ...prev, status: 'paused' };
    });
  }, []);

  /**
   * Resumes the paused timer.
   */
  const resumeQuiz = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'paused') return prev;
      return { ...prev, status: 'playing' };
    });
  }, []);

  /**
   * Record individual answer selections.
   */
  const selectOption = useCallback((optionText: string, questionId?: string) => {
    setState((prev) => {
      const targetId = questionId || prev.questions[prev.currentQuestionIndex]?.id;
      if (!targetId) return prev;

      // Disable overriding responses once selected in immediate feedback mode
      if (prev.settings.showImmediateFeedback && prev.userResponses[targetId] !== undefined) {
        return prev;
      }

      return {
        ...prev,
        userResponses: {
          ...prev.userResponses,
          [targetId]: optionText,
        },
      };
    });
  }, []);

  /**
   * Progress forward or submit if last.
   */
  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const isLast = prev.currentQuestionIndex === prev.questions.length - 1;
      if (isLast) {
        return { ...prev, status: 'completed' };
      }
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      };
    });
  }, []);

  /**
   * Regression back to the previous question card.
   */
  const prevQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestionIndex === 0) return prev;
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      };
    });
  }, []);

  /**
   * Jumps straight to a targeted index position.
   */
  const jumpToQuestion = useCallback((index: number) => {
    setState((prev) => {
      if (index < 0 || index >= prev.questions.length) return prev;
      return {
        ...prev,
        currentQuestionIndex: index,
      };
    });
  }, []);

  /**
   * Force premature submission of all answered questions.
   */
  const submitQuiz = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'completed',
    }));
  }, []);

  // Compute stats for live usage
  const currentQuestion = state.questions[state.currentQuestionIndex] || null;
  const currentQuestionResponse = currentQuestion ? state.userResponses[currentQuestion.id] : undefined;
  const currentQuestionTimeSpent = currentQuestion ? (state.timeSpent[currentQuestion.id] || 0) : 0;
  
  // Calculate final score when requested
  const getResultsSummary = useCallback(() => {
    const { questions, userResponses } = state;
    let correctCount = 0;
    const items = questions.map((q) => {
      const selected = userResponses[q.id] || '';
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        question: q,
        selectedAnswer: selected,
        isCorrect,
        correctValue: q.correctAnswer,
        timeSpentSeconds: state.timeSpent[q.id] || 0,
      };
    });

    const percent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const isPassed = percent >= state.settings.passingScore;

    return {
      totalQuestions: questions.length,
      correctCount,
      incorrectCount: questions.length - correctCount,
      scorePercentage: percent,
      isPassed,
      items,
      totalElapsedTime: state.totalElapsedTime,
    };
  }, [state]);

  return {
    state,
    currentQuestion,
    currentQuestionResponse,
    currentQuestionTimeSpent,
    startQuiz,
    resetQuiz,
    pauseQuiz,
    resumeQuiz,
    selectOption,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    submitQuiz,
    getResultsSummary,
  };
}
