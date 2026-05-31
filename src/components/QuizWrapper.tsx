import { Pause, ChevronLeft, ChevronRight, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { QuizState, Question } from '../types/quiz';
import { ThemeConfig } from '../App';

interface QuizWrapperProps {
  state: QuizState;
  currentQuestion: Question;
  currentQuestionResponse: string | undefined;
  currentQuestionTimeSpent: number;
  selectOption: (optText: string, questionId?: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  pauseQuiz: () => void;
  resumeQuiz: () => void;
  submitQuiz: () => void;
  theme?: ThemeConfig;
}

export default function QuizWrapper({
  state,
  currentQuestion,
  currentQuestionResponse,
  currentQuestionTimeSpent,
  selectOption,
  nextQuestion,
  prevQuestion,
  jumpToQuestion,
  pauseQuiz,
  resumeQuiz,
  submitQuiz,
  theme,
}: QuizWrapperProps) {
  const { questions, currentQuestionIndex, userResponses, settings } = state;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Fallback defaults representing 'slate' style tokens
  const t = theme || {
    bg: 'bg-slate-950 text-slate-100',
    text: 'text-slate-300',
    headerBg: 'bg-slate-900/60 border-slate-900',
    borderColor: 'border-slate-800/80',
    cardBg: 'bg-slate-900/90 border-slate-800',
    innerBg: 'bg-slate-950/40 border-slate-850',
    accentColor: 'text-indigo-400',
    accentBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/15',
    hoverBg: 'hover:bg-slate-900/90 hover:border-slate-700',
    badgeBg: 'bg-slate-950/70 border-slate-850 text-slate-400',
    btnPrimary: 'bg-indigo-600 hover:bg-indigo-550 text-white shadow-indigo-950/40',
    glow: 'from-indigo-500/5 to-transparent',
    textMuted: 'text-slate-400',
    textHeading: 'text-white',
    optionUnselected: 'bg-slate-950/40 border-slate-850 text-slate-300',
    optionSelected: 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-indigo-950/20'
  };

  // Format second offsets as mm:ss
  const formatTime = (totalSecs: number): string => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine active remaining time per question (if limited)
  const isTimed = settings.timeLimitPerQuestion > 0;
  const remainingSecs = isTimed ? Math.max(0, settings.timeLimitPerQuestion - currentQuestionTimeSpent) : 0;
  const timerPercent = isTimed ? (remainingSecs / settings.timeLimitPerQuestion) * 100 : 100;

  // Track if question has been attempted
  const totalQuestionsCount = questions.length;
  const attemptedCount = Object.keys(userResponses).length;

  // Custom visual classes mapped dynamically to themes
  const isScrollMode = settings.solvingTemplate === 'scroll';

  const activeAccentBorderClass = t.accentColor.includes('emerald')
    ? 'border-emerald-500'
    : t.accentColor.includes('amber')
      ? 'border-amber-405 border-amber-500'
      : 'border-indigo-500';

  const activeAccentBgClass = t.accentColor.includes('emerald')
    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
    : t.accentColor.includes('amber')
      ? 'bg-amber-500/10 border-amber-500/25 text-amber-400 font-bold'
      : 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400';

  const isZinc = theme?.bg?.includes('zinc');

  const getOptionStyles = (option: string, question: Question, userResponse: string | undefined) => {
    const isSelected = userResponse === option;
    const hasBeenAnswered = userResponse !== undefined;

    if (settings.showImmediateFeedback && hasBeenAnswered) {
      const isCorrectOption = option === question.correctAnswer;
      const isIncorrectSelection = isSelected && !isCorrectOption;

      if (isCorrectOption) {
        return {
          card: isZinc
            ? 'bg-emerald-100/90 border-emerald-500 text-emerald-900 font-extrabold shadow-sm'
            : 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300 md:text-emerald-250 font-bold',
          indicator: 'bg-emerald-500 border-emerald-600 text-white shadow-md'
        };
      } else if (isIncorrectSelection) {
        return {
          card: isZinc
            ? 'bg-rose-100/90 border-rose-500 text-rose-900 font-extrabold shadow-sm animate-shake'
            : 'bg-rose-500/15 border-rose-500/60 text-rose-300 md:text-rose-250 font-bold',
          indicator: 'bg-rose-500 border-rose-600 text-white shadow-md'
        };
      } else {
        return {
          card: 'opacity-40 border-slate-500/5 text-slate-400 pointer-events-none',
          indicator: 'bg-slate-500/5 text-slate-550 border-slate-500/10'
        };
      }
    }

    return {
      card: isSelected ? t.optionSelected : t.optionUnselected,
      indicator: isSelected
        ? t.accentColor.includes('emerald')
          ? 'bg-emerald-600 border-emerald-555 text-white shadow-md'
          : t.accentColor.includes('amber')
            ? 'bg-amber-500 border-amber-444 text-stone-950 font-bold'
            : 'bg-indigo-600 border-indigo-555 text-white shadow-md'
        : `${t.innerBg} text-slate-400 border-slate-700/20 group-hover:border-slate-500`
    };
  };

  const handleSelectOptionWithAutoAdvance = (option: string, questionId?: string) => {
    const targetId = questionId || currentQuestion.id;

    // Reject changes if immediate feedback is active and answer was already set
    if (settings.showImmediateFeedback && userResponses[targetId] !== undefined) {
      return;
    }

    selectOption(option, targetId);

    if (settings.autoAdvance && settings.solvingTemplate === 'slide') {
      const delay = settings.showImmediateFeedback ? 1000 : 300;
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          nextQuestion();
        }
      }, delay);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start font-sans" id="quiz-wrapper-layout">
      {/* Active Question Panel */}
      <div className="lg:col-span-2 space-y-6">
        
        {isScrollMode ? (
          // SCROLL LIST VIEW CHOP (Pastga scroll qilib ishlanadigan feed layout)
          <div className="space-y-6" id="scroll-questions-feed">
            {/* Scroll overview instructions card */}
            <div className={`border rounded-xl p-5 shadow-sm text-left ${t.cardBg} ${t.borderColor}`} id="scroll-overview-header">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-3">
                <div className="space-y-1">
                  <span className={`font-mono font-bold uppercase tracking-wider text-[10px] px-2.5 py-0.5 rounded-lg ${t.badgeBg}`}>
                    Uzun sahifa (Continuous feed)
                  </span>
                  <h3 className={`font-sans font-bold text-sm mt-1 text-slate-100 ${t.textHeading}`}>
                    Ko&apos;p savolli qulay yechish rejimi
                  </h3>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-400 leading-normal max-w-sm">
                    Bu rejimda barcha savollar ketma-ketlikda list holatida chiqadi. Variant tanlasangiz avtomatik saqlanib boradi.
                  </p>
                  <p className="text-[10px] mt-1 font-mono text-slate-500">
                    Jami yechildi: <strong className={`${t.accentColor} font-black`}>{attemptedCount}</strong> ta / {totalQuestionsCount} tadan
                  </p>
                </div>
              </div>
            </div>

            {/* Questions lists */}
            <div className="space-y-6">
              {questions.map((q, idx) => {
                const isSelectedFocus = idx === currentQuestionIndex;
                const qResponse = userResponses[q.id];

                return (
                  <div
                    key={q.id}
                    id={`question-scroll-card-${idx}`}
                    onClick={() => jumpToQuestion(idx)}
                    className={`border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative text-left transition-all duration-300 ${t.cardBg} ${
                      isSelectedFocus ? `${activeAccentBorderClass} ring-1 ring-opacity-25` : t.borderColor
                    }`}
                  >
                    <div className="flex items-center justify-between border-b pb-3 border-slate-500/10">
                      <div className="flex items-center gap-2.5">
                        <span className={`font-mono text-sm font-bold w-9 h-9 flex items-center justify-center rounded-xl shrink-0 select-none border ${
                          isSelectedFocus ? activeAccentBgClass : t.badgeBg
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <span className={`text-[9px] px-2.5 py-0.5 rounded-lg font-mono tracking-wider font-bold ${
                            qResponse ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400'
                          }`}>
                            {qResponse ? 'BELGILANDI' : 'YECHILMAGAN'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById("questions-map-con")?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-[10px] text-slate-450 text-slate-500 hover:text-slate-350 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        Indikator xaritasiga sakrash
                      </button>
                    </div>

                    <div className="space-y-4 pt-1">
                      <h4 className={`font-sans font-medium text-sm sm:text-base leading-relaxed ${t.textHeading}`}>
                        {q.questionText}
                      </h4>

                      <div className="space-y-2.5">
                        {q.options.map((option, oIdx) => {
                          const prefix = String.fromCharCode(65 + oIdx);
                          const styles = getOptionStyles(option, q, qResponse);
                          const hasBeenAnswered = qResponse !== undefined;

                          return (
                            <button
                              key={oIdx}
                              disabled={hasBeenAnswered && settings.showImmediateFeedback}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectOptionWithAutoAdvance(option, q.id);
                                jumpToQuestion(idx); // keep parent state focused index aligned
                              }}
                              className={`w-full text-left font-sans flex items-center gap-3 w-full p-3.5 rounded-xl border transition-all duration-200 cursor-pointer group ${
                                styles.card
                              }`}
                            >
                              <span className={`w-7 h-7 rounded-lg font-mono text-[11px] font-bold flex items-center justify-center shrink-0 border transition-colors ${
                                styles.indicator
                              }`}>
                                {prefix}
                              </span>
                              <span className="text-xs sm:text-sm leading-relaxed">{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continuous Solve footer links */}
            <div className={`border rounded-2xl p-6 text-left flex flex-col sm:flex-row justify-between items-center gap-4 ${t.cardBg} ${t.borderColor}`}>
              <div className="space-y-1">
                <p className={`font-bold text-xs ${t.textHeading}`}>Test yakunlandimi?</p>
                <p className="text-[10px] text-slate-400">
                  Hammasi tekshirildi, belgilangan javoblarni qayta hisoblash uchun tugmani bosing.
                </p>
              </div>
              <button
                onClick={submitQuiz}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl transition-all font-sans text-xs font-bold shadow-md cursor-pointer select-none ${t.btnPrimary}`}
                id="btn-scroll-summary-submit"
              >
                <CheckSquare className="w-4 h-4 shrink-0" />
                Natijani olish / Submit Response
              </button>
            </div>
          </div>
        ) : (
          // SLIDE BY SLIDE CLASSIC CHOP
          <>
            {/* Progress track */}
            <div className={`border rounded-2xl p-5 shadow-sm text-left ${t.cardBg} ${t.borderColor}`} id="quiz-progress-panel">
              <div className="flex justify-between items-center text-xs mb-3">
                <span className={`font-mono font-bold uppercase tracking-wider ${t.accentColor}`}>
                  SAVOL / QUESTION {currentQuestionIndex + 1} / {totalQuestionsCount}
                </span>
                <span className="font-sans text-slate-400">
                  Yechildi: <strong className={`${t.textHeading} font-mono`}>{attemptedCount}</strong> / {totalQuestionsCount}
                </span>
              </div>
              
              <div className={`h-2.5 w-full rounded-full overflow-hidden border ${t.innerBg} ${t.borderColor}`}>
                <div
                  className={`h-full transition-all duration-300 ${
                    t.accentColor.includes('emerald') ? 'bg-emerald-500' :
                    t.accentColor.includes('amber') ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestionsCount) * 100}%` }}
                />
              </div>
            </div>

            {/* Active Question Slate Card */}
            <div className={`border rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 relative text-left ${t.cardBg} ${t.borderColor}`} id="active-question-card">
              {/* Question Text */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-xl font-bold w-12 h-12 flex items-center justify-center rounded-2xl shrink-0 select-none border ${t.accentBg}`}>
                    {currentQuestionIndex + 1}
                  </span>
                  <span className={`text-[10px] px-2.5 py-1 rounded-lg font-mono tracking-wider font-bold ${t.badgeBg}`}>
                    YAGONA TANLOV
                  </span>
                </div>
                
                <h2 className={`font-sans font-medium text-base sm:text-lg leading-relaxed ${t.textHeading}`}>
                  {currentQuestion.questionText}
                </h2>
              </div>

              {/* Options list */}
              <div className="space-y-4" id="options-choices-list">
                {currentQuestion.options.map((option, idx) => {
                  const prefixLetter = String.fromCharCode(65 + idx); // A, B, C, D...
                  const styles = getOptionStyles(option, currentQuestion, currentQuestionResponse);
                  const hasBeenAnswered = currentQuestionResponse !== undefined;

                  return (
                    <button
                      key={idx}
                      disabled={hasBeenAnswered && settings.showImmediateFeedback}
                      onClick={() => handleSelectOptionWithAutoAdvance(option)}
                      className={`w-full text-left font-sans flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer group ${
                        styles.card
                      }`}
                      id={`choice-option-${prefixLetter}`}
                    >
                      <span className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 border transition-colors ${
                        styles.indicator
                      }`}>
                        {prefixLetter}
                      </span>
                      <span className="text-xs sm:text-sm leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Navigation bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4" id="quiz-navigation-footer">
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 border disabled:opacity-40 disabled:pointer-events-none text-slate-300 font-bold hover:text-white px-5 py-3 rounded-2xl transition-all font-sans text-xs font-semibold cursor-pointer select-none ${t.innerBg} ${t.borderColor}`}
                  id="btn-nav-prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Ortga / Back
                </button>

                <button
                  onClick={nextQuestion}
                  disabled={isLastQuestion}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 border disabled:opacity-40 disabled:pointer-events-none text-slate-300 font-bold hover:text-white px-5 py-3 rounded-2xl transition-all font-sans text-xs font-semibold cursor-pointer select-none ${t.innerBg} ${t.borderColor}`}
                  id="btn-nav-next"
                >
                  Keyingisi / Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={submitQuiz}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl transition-all font-sans text-xs font-bold shadow-md cursor-pointer select-none ${t.btnPrimary}`}
                id="btn-submit-test"
              >
                <CheckSquare className="w-4 h-4 shrink-0" />
                Testni tugatish / Submit Quiz
              </button>
            </div>
          </>
        )}
      </div>

      {/* Control Panel / Side Console */}
      <div className="space-y-6 text-left" id="quiz-sidebar-control">
        {/* Dynamic Timers console */}
        <div className={`border rounded-3xl p-6 shadow-sm space-y-6 text-center relative overflow-hidden ${t.cardBg} ${t.borderColor}`} id="timer-gauge-box">
          <div className="absolute top-0 right-0 p-2 opacity-[0.02] pointer-events-none">
            <Clock className="w-24 h-24 text-white" />
          </div>

          <div className={`flex items-center justify-between border-b pb-4 ${t.borderColor}`}>
            <h3 className={`font-sans font-bold text-sm tracking-tight flex items-center gap-2 ${t.textHeading}`}>
              <Clock className="w-4 h-4 text-slate-400" />
              Soniya hisoblagichi
            </h3>
            <button
              onClick={pauseQuiz}
              className={`flex items-center gap-1.5 border hover:text-red-400 rounded-xl px-2.5 py-1.5 transition-all text-[11px] font-sans font-bold cursor-pointer select-none ${t.innerBg} ${t.borderColor}`}
              id="btn-pause-quiz"
            >
              <Pause className="w-3 h-3 text-red-500 hover:text-red-400" />
              To&apos;xtatish
            </button>
          </div>

          {/* Time Limit Visual Counter */}
          {isTimed ? (
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-bold text-rose-455 text-rose-400 font-mono tracking-wider uppercase">
                  Savol Vaqti / Item Timer
                </span>
                <span className="font-mono text-2xl font-black text-rose-455 text-rose-400">
                  {formatTime(remainingSecs)}
                </span>
              </div>
              
              <div className={`h-1.5 w-full rounded-full overflow-hidden border ${t.innerBg} ${t.borderColor}`}>
                <div
                  className={`h-full transition-all duration-300 ${
                    timerPercent < 25 ? 'bg-red-500' : timerPercent < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${timerPercent}%` }}
                />
              </div>
              {timerPercent < 25 && (
                <p className="flex items-center gap-1 justify-center text-[9px] text-red-500 font-bold leading-none animate-pulse">
                  <AlertCircle className="w-3 h-3" /> Vaqt kam qoldi! Tezroq belgilang!
                </p>
              )}
            </div>
          ) : (
            <div className={`border rounded-xl p-3 text-slate-450 text-slate-400 text-xs text-center font-sans ${t.innerBg} ${t.borderColor}`}>
              Savollar uchun vaqt cheklovi yo&apos;q
            </div>
          )}

          {/* General Total Elapsed Timer */}
          <div className={`flex justify-between items-center rounded-2xl p-4 ${t.innerBg} ${t.borderColor}`}>
            <div className="text-left font-sans">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Umumiy ketgan vaqt / Total Elapsed</p>
              <p className={`font-mono text-lg font-black mt-1 ${t.textHeading}`}>
                {formatTime(state.totalElapsedTime)}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-slate-500/10 text-slate-400 border border-slate-700/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Dynamic Jump Grid / Question Map */}
        <div className={`border rounded-3xl p-6 shadow-sm space-y-4 ${t.cardBg} ${t.borderColor}`} id="questions-map-con">
          <div className={`flex justify-between items-center border-b pb-3 ${t.borderColor}`}>
            <h3 className={`font-sans font-bold text-sm tracking-tight ${t.textHeading}`}>
              Savollar xaritasi / Navigation
            </h3>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold ${t.badgeBg}`}>
              {attemptedCount}/{totalQuestionsCount} items
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal">
            Istalgan savol raqamini bosib to&apos;g&apos;ridan-to&apos;g&apos;ri o&apos;tishingiz {isScrollMode ? 'va auto-scroll qildirishingiz' : ''} mumkin.
          </p>

          <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6 gap-2 pt-2" id="grid-indicators-grid">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentQuestionIndex;
              const hasResponse = !!userResponses[q.id];
              const isTimedOut = userResponses[q.id] === '[TIMED OUT]';

              let btnBg = `${t.innerBg} ${t.borderColor} text-slate-400 hover:border-slate-500`;
              if (isCurrent) {
                btnBg = t.accentColor.includes('emerald')
                  ? 'bg-emerald-600 border-emerald-450 text-white font-black scale-105'
                  : t.accentColor.includes('amber')
                    ? 'bg-amber-500 border-amber-450 text-stone-950 font-black scale-105'
                    : 'bg-indigo-600 border-indigo-400 text-white font-bold scale-105';
              } else if (isTimedOut) {
                btnBg = 'bg-rose-955/35 border-rose-900 text-rose-400';
              } else if (hasResponse) {
                btnBg = 'bg-emerald-950/20 border-emerald-900/60 text-emerald-500 font-bold';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    jumpToQuestion(idx);
                    if (isScrollMode) {
                      const element = document.getElementById(`question-scroll-card-${idx}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }
                  }}
                  className={`aspect-square p-2 flex items-center justify-center rounded-xl text-xs font-mono border transition-all duration-150 cursor-pointer ${btnBg}`}
                  id={`jump-target-index-${idx + 1}`}
                  title={`Question ${idx + 1} ${hasResponse ? '(Answered)' : '(Unanswered)'}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Grid Legend icons */}
          <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 border-t text-[10px] font-mono font-bold tracking-wide text-slate-500 uppercase ${t.borderColor}`}>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-md ${
                t.accentColor.includes('emerald') ? 'bg-emerald-600' :
                t.accentColor.includes('amber') ? 'bg-amber-500' : 'bg-indigo-650'
              }`} />
              <span>Hozirgi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#0a1811] border border-emerald-900 rounded-md" />
              <span>Yechilgan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-md border ${t.innerBg} ${t.borderColor}`} />
              <span>Yechilmagan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
