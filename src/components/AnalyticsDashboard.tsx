import { useState, useMemo } from 'react';
import { RefreshCw, ArrowLeft, CheckCircle, XCircle, Clock, Award, Filter, BarChart3, HelpCircle } from 'lucide-react';
import { Question, QuizSettings } from '../types/quiz';
import { ThemeConfig } from '../App';
import { ChevronRight } from 'lucide-react';

interface AnalyticsDashboardProps {
  getResultsSummary: () => {
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    scorePercentage: number;
    isPassed: boolean;
    items: Array<{
      question: Question;
      selectedAnswer: string;
      isCorrect: boolean;
      correctValue: string;
      timeSpentSeconds: number;
    }>;
    totalElapsedTime: number;
  };
  onRestart: () => void;
  onBackToUpload: () => void;
  theme?: ThemeConfig;
  settings?: QuizSettings;
  totalQuestionsPoolCount?: number;
  onNextBlock?: () => void;
}

export default function AnalyticsDashboard({
  getResultsSummary,
  onRestart,
  onBackToUpload,
  theme,
  settings,
  totalQuestionsPoolCount = 0,
  onNextBlock,
}: AnalyticsDashboardProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const results = useMemo(() => getResultsSummary(), [getResultsSummary]);

  const { totalQuestions, correctCount, incorrectCount, scorePercentage, isPassed, items, totalElapsedTime } = results;

  // Fallback defaults representing 'slate' style tokens
  const t = theme || {
    bg: 'bg-slate-950 text-slate-100',
    text: 'text-slate-300',
    headerBg: 'bg-slate-900/60 border-slate-900',
    borderColor: 'border-slate-800/80',
    cardBg: 'bg-slate-900/90 border-slate-800',
    innerBg: 'bg-slate-950/40 border-slate-850',
    accentColor: 'text-indigo-400',
    accentBg: 'bg-indigo-505/10 text-indigo-404 border-indigo-550/15',
    hoverBg: 'hover:bg-slate-900/90 hover:border-slate-700',
    badgeBg: 'bg-slate-950/70 border-slate-850 text-slate-400',
    btnPrimary: 'bg-indigo-600 hover:bg-indigo-550 text-white shadow-indigo-950/40',
    glow: 'from-indigo-500/5 to-transparent',
    textMuted: 'text-slate-400',
    textHeading: 'text-white',
    optionUnselected: 'bg-slate-950/40 border-slate-850 text-slate-300',
    optionSelected: 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-indigo-950/20'
  };

  // Filter items based on selected tab filter
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeFilter === 'correct') return item.isCorrect;
      if (activeFilter === 'incorrect') return !item.isCorrect;
      return true;
    });
  }, [items, activeFilter]);

  // Compute average time spent
  const avgTime = totalQuestions > 0 ? Math.round(totalElapsedTime / totalQuestions) : 0;

  // Format seconds mm:ss
  const formatTime = (totalSecs: number): string => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  // Find max time spent for normalisation in time spent graph
  const maxTimeSpent = useMemo(() => {
    return Math.max(...items.map((i) => i.timeSpentSeconds), 5);
  }, [items]);

  const restartBtnClass = t.accentColor.includes('emerald')
    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
    : t.accentColor.includes('amber')
      ? 'bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold'
      : t.btnPrimary.includes('zinc')
        ? 'bg-zinc-900 hover:bg-zinc-805 bg-black hover:bg-zinc-800 text-white'
        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/30';

  return (
    <div className="space-y-8 animate-fade-in font-sans" id="analytics-dashboard-panel">
      {/* Visual Result Hero Card */}
      <div className={`border rounded-3xl p-6 sm:p-8 overflow-hidden relative shadow-sm ${t.borderColor} ${t.cardBg}`} id="results-hero-card">
        {/* Glow ambient background circles */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full filter blur-[100px] opacity-10 pointer-events-none -mr-20 -mt-20 ${
          isPassed ? 'bg-emerald-500' : 'bg-rose-500'
        }`} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center relative">
          {/* Circular Percentage gauge */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center select-none">
              {/* SVG Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={theme?.bg?.includes('zinc') ? 'stroke-zinc-100' : 'stroke-slate-800'}
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={`transition-all duration-1000 ${
                    isPassed ? 'stroke-emerald-500' : 'stroke-rose-500'
                  }`}
                  strokeWidth="8"
                  strokeDasharray={`${2.512 * 42}`}
                  strokeDashoffset={`${2.512 * 42 * (1 - scorePercentage / 100)}`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center">
                <span className={`font-mono text-3xl font-black ${t.textHeading}`}>{scorePercentage}%</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">Natija</p>
              </div>
            </div>
          </div>

          {/* Core result title / copy */}
          <div className="md:col-span-3 space-y-4 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider font-mono uppercase border ${
                  isPassed
                    ? 'bg-emerald-500/10 text-emerald-555 text-emerald-500 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                }`}>
                  {isPassed ? 'Muvaffaqiyatli o‘tdingiz / PASSED' : 'Yetarli ball to‘planmadi / FAILED'}
                </span>
                {settings?.chunkMode && settings?.questionMode === 'subset' && (
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider font-mono uppercase border bg-indigo-500/10 text-indigo-400 border-indigo-500/20 ${t.badgeBg}`}>
                    🧩 {settings.activeChunkIndex !== undefined ? settings.activeChunkIndex + 1 : 1}-blok ({((settings.activeChunkIndex || 0) * (settings?.subsetCount || 25)) + 1}-{Math.min(totalQuestionsPoolCount, ((settings.activeChunkIndex || 0) + 1) * (settings?.subsetCount || 25))})
                  </span>
                )}
              </div>
              <h2 className={`font-sans font-black text-2xl sm:text-3xl tracking-tight leading-tight ${t.textHeading}`}>
                {isPassed ? 'Tabriklaymiz! Test yakunlandi' : 'Natija yetarli emas. Yana urinib ko‘ring'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
                {isPassed
                  ? `Siz belgilangan o‘tish balidan balandroq natija ko‘rsatdingiz va fanni muvaffaqiyatli o‘zlashtirganligingiz tasdiqlandi.`
                  : 'Tavsiya: Xatolar ustida ishlab, konspektlarni ko‘rib chiqing va testni qaytadan topshiring.'}
              </p>
            </div>

            {/* Quick interactive action buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              {(() => {
                const size = settings?.subsetCount || 25;
                const activeChunkIndex = settings?.activeChunkIndex || 0;
                const hasNextBlock = settings?.questionMode === 'subset' && settings?.chunkMode && ((activeChunkIndex + 1) * size < totalQuestionsPoolCount);

                return (
                  <>
                    {hasNextBlock && onNextBlock && (
                      <button
                        onClick={onNextBlock}
                        className={`flex items-center gap-2 font-black font-sans text-xs px-6 py-3.5 rounded-2xl transition-all cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] select-none ${
                          t.accentColor.includes('emerald')
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : t.accentColor.includes('amber')
                              ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold'
                              : 'bg-indigo-650 bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40'
                        }`}
                        id="btn-next-chunk-block"
                      >
                        <ChevronRight className="w-4 h-4 text-current shrink-0" />
                        <span>
                          Keyingi blokni boshlash: {activeChunkIndex + 2}-blok ({(activeChunkIndex + 1) * size + 1}-{Math.min(totalQuestionsPoolCount, (activeChunkIndex + 2) * size)})
                        </span>
                      </button>
                    )}

                    <button
                      onClick={onRestart}
                      className={`flex items-center gap-2 font-black font-sans text-xs px-5 py-3.5 rounded-2xl transition-all cursor-pointer shadow-sm select-none ${restartBtnClass}`}
                      id="btn-restart-quiz"
                    >
                      <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                      Qayta topshirish / Retake
                    </button>
                  </>
                );
              })()}
              
              <button
                onClick={onBackToUpload}
                className={`flex items-center gap-2 border text-slate-300 hover:text-white font-semibold font-sans text-xs px-5 py-3.5 rounded-2xl transition-all cursor-pointer ${t.innerBg} ${t.borderColor}`}
                id="btn-upload-new"
              >
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                Yangi test yuklash / Change File
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Stats Panel Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-bento-row">
        <div className={`border rounded-2xl p-5 shadow-sm flex items-center gap-4 text-left ${t.cardBg} ${t.borderColor}`}>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/10">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-405 text-slate-400">To&apos;g&apos;ri javob / Correct</p>
            <p className={`font-mono text-xl font-bold mt-1 ${t.textHeading}`}>
              {correctCount} <span className="text-xs text-slate-400">/ {totalQuestions}</span>
            </p>
          </div>
        </div>

        <div className={`border rounded-2xl p-5 shadow-sm flex items-center gap-4 text-left ${t.cardBg} ${t.borderColor}`}>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/10">
            <XCircle className="w-5 h-5" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-405 text-slate-400">Noto&apos;g&apos;ri / Incorrect</p>
            <p className={`font-mono text-xl font-bold mt-1 ${t.textHeading}`}>
              {incorrectCount} <span className="text-xs text-slate-400">/ {totalQuestions}</span>
            </p>
          </div>
        </div>

        <div className={`border rounded-2xl p-5 shadow-sm flex items-center gap-4 text-left ${t.cardBg} ${t.borderColor}`}>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/10">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-405 text-slate-400">Ketingan vaqt / Time</p>
            <p className={`font-mono text-xl font-bold mt-1 ${t.textHeading}`}>
              {formatTime(totalElapsedTime)}
            </p>
          </div>
        </div>

        <div className={`border rounded-2xl p-5 shadow-sm flex items-center gap-4 text-left ${t.cardBg} ${t.borderColor}`}>
          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/10">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-405 text-slate-400">O&apos;rtacha vaqt / Avg Secs</p>
            <p className={`font-mono text-xl font-bold mt-1 ${t.textHeading}`}>
              {avgTime}s <span className="text-xs text-slate-450 text-slate-400">/ savol</span>
            </p>
          </div>
        </div>
      </div>

      {/* SVG Time Spent Column Chart Block */}
      <div className={`border rounded-3xl p-6 shadow-sm space-y-4 text-left ${t.cardBg} ${t.borderColor}`} id="time-spent-barchart">
        <h3 className={`font-sans font-bold text-sm tracking-tight flex items-center gap-2 ${t.textHeading}`}>
          <BarChart3 className={`w-4 h-4 ${t.accentColor}`} />
          Savollar Kesimi Bo&apos;yicha Sarflangan Vaqt (Soniya)
        </h3>
        <p className="text-xs text-slate-400 leading-normal">
          Ushbu grafik har bir test ustida necha soniya mulohaza yuritilganini ifoda etadi. To&apos;g&apos;ri yechilganlari yashil, xato qilinganlari esa ko&apos;k rangda belgilanadi.
        </p>

        {/* Custom clean CSS flex columns chart simulating charts cleanly */}
        <div className="pt-6" id="barchart-container">
          <div className={`flex items-end gap-2.5 sm:gap-4 h-48 border-b border-l pb-1 pl-2 ${t.borderColor}`}>
            {items.map((item, idx) => {
              const heightPercent = maxTimeSpent > 0 ? (item.timeSpentSeconds / maxTimeSpent) * 100 : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className={`absolute bottom-full mb-1.5 hidden group-hover:block border text-[10px] font-mono font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 ${t.badgeBg} ${t.borderColor}`}>
                    {item.timeSpentSeconds} s ketdi
                  </div>
                  
                  {/* Visual column bar */}
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      item.isCorrect
                        ? 'bg-emerald-500 hover:bg-emerald-400'
                        : 'bg-indigo-500 hover:bg-indigo-400'
                    }`}
                    style={{ height: `${Math.max(4, heightPercent)}%` }}
                  />

                  {/* Question number index */}
                  <span className="text-[9px] font-mono text-slate-400 mt-2 font-bold group-hover:text-slate-200 select-none">
                    S{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-2 font-semibold">
            <span>START</span>
            <span>QUESTIONS CHRONOLOGY</span>
            <span>END</span>
          </div>
        </div>
      </div>

      {/* Review Section Grid with filters */}
      <div className={`border rounded-3xl p-6 shadow-sm space-y-6 text-left ${t.cardBg} ${t.borderColor}`} id="review-items-box">
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${t.borderColor}`}>
          <h3 className={`font-sans font-bold text-sm tracking-tight flex items-center gap-2 ${t.textHeading}`}>
            <Filter className={`w-4 h-4 ${t.accentColor}`} />
            Xatolar ustida ishlash / Test Review
          </h3>

          <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${t.innerBg} ${t.borderColor}`}>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? t.accentColor.includes('emerald')
                    ? 'bg-emerald-600 text-white'
                    : t.accentColor.includes('amber')
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-indigo-650 bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Barchasi ({totalQuestions})
            </button>
            <button
              onClick={() => setActiveFilter('correct')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                activeFilter === 'correct'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              To&apos;g&apos;ri ({correctCount})
            </button>
            <button
              onClick={() => setActiveFilter('incorrect')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                activeFilter === 'incorrect'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-rose-450 text-rose-400'
              }`}
            >
              Xatolar ({incorrectCount})
            </button>
          </div>
        </div>

        {/* Actual questions list */}
        <div className="space-y-4" id="review-feed-questions">
          {filteredItems.length === 0 ? (
            <div className="text-center py-6 text-slate-500 font-sans text-xs">
              Ushbu turkumda savollar topilmadi.
            </div>
          ) : (
            filteredItems.map(({ question, selectedAnswer, isCorrect, correctValue, timeSpentSeconds }, idx) => {
              return (
                <div
                  key={question.id}
                  className={`border rounded-2xl p-5 space-y-4 transition-all ${
                    isCorrect
                      ? 'bg-emerald-500/5 border-emerald-900/20'
                      : 'bg-rose-500/5 border-rose-900/20'
                  }`}
                  id={`review-question-row-${question.id}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2.5 text-left">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${t.badgeBg} ${t.borderColor}`}>
                        Q{question.number || (idx + 1)}
                      </span>
                      <span className={`text-[9px] font-mono tracking-wide font-bold px-2 py-0.5 rounded border uppercase ${
                        isCorrect
                          ? 'bg-emerald-500/10 text-emerald-450 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {isCorrect ? 'To‘g‘ri' : 'Xato'}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      Vaqt: {timeSpentSeconds}s {selectedAnswer === '[TIMED OUT]' && ' (Tugadi)'}
                    </span>
                  </div>

                  <p className={`font-sans font-medium text-xs sm:text-sm leading-relaxed text-left ${t.textHeading}`}>
                    {question.questionText}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Selected Answer block */}
                    <div className={`p-3.5 rounded-xl border text-left ${t.innerBg} ${t.borderColor}`}>
                      <p className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Sizning tanlov</p>
                      <p className={`text-xs mt-1 font-medium ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {selectedAnswer || <span className="italic text-slate-400">[Tanlanmagan / Unanswered]</span>}
                      </p>
                    </div>

                    {/* Correct Answer block */}
                    <div className={`p-3.5 rounded-xl border text-left ${t.innerBg} ${t.borderColor}`}>
                      <p className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase font-sans">To&apos;g&apos;ri javob</p>
                      <p className="text-xs text-emerald-400 mt-1 font-medium italic">
                        {correctValue}
                      </p>
                    </div>
                  </div>

                  {/* Explanation Block */}
                  {question.explanation && (
                    <div className={`rounded-xl border p-4 text-xs text-left text-slate-300 space-y-1.5 ${t.innerBg} ${t.borderColor}`}>
                      <h5 className="font-sans font-bold text-slate-200 text-[10px] uppercase tracking-wide flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
                        Izoh / Explanation:
                      </h5>
                      <p className="leading-relaxed font-sans text-slate-402 text-slate-400">{question.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
