import { useState, useEffect } from 'react';
import { useQuiz } from './hooks/useQuiz';
import { ParserResult, QuizSettings } from './types/quiz';
import FileUploader from './components/FileUploader';
import QuizWrapper from './components/QuizWrapper';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TemplateFormatTips from './components/TemplateFormatTips';
import { 
  Play, Settings, FileSpreadsheet, FileText, ChevronRight, CheckSquare, 
  Trash2, HelpCircle, ArrowLeft, BrainCircuit, Globe, RefreshCcw, LogOut, Sparkles
} from 'lucide-react';

export interface ThemeConfig {
  bg: string;
  text: string;
  headerBg: string;
  borderColor: string;
  cardBg: string;
  innerBg: string;
  accentColor: string;
  accentBg: string;
  hoverBg: string;
  badgeBg: string;
  btnPrimary: string;
  glow: string;
  textMuted: string;
  textHeading: string;
  optionUnselected: string;
  optionSelected: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  // Theme 1: Atmospheric Dark/Slate (Classic Slate)
  slate: {
    bg: 'bg-slate-950 text-slate-100',
    text: 'text-slate-300',
    headerBg: 'bg-slate-900/60 border-slate-900',
    borderColor: 'border-slate-800/80',
    cardBg: 'bg-slate-900/90 border-slate-800/80 shadow-xl shadow-slate-950/20',
    innerBg: 'bg-slate-950/40 border-slate-850',
    accentColor: 'text-indigo-400',
    accentBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    hoverBg: 'hover:bg-slate-900/90 hover:border-slate-700',
    badgeBg: 'bg-slate-950/70 border-slate-850 text-slate-400',
    btnPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40 focus:ring-indigo-500/20',
    glow: 'from-indigo-500/5 to-transparent',
    textMuted: 'text-slate-400',
    textHeading: 'text-white',
    optionUnselected: 'bg-slate-950/40 border-slate-850 text-slate-300 hover:bg-slate-950/80 hover:border-slate-700 hover:text-white',
    optionSelected: 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-indigo-950/20'
  },
  // Theme 2: Minimalist Zinc (Modern Light)
  zinc: {
    bg: 'bg-zinc-50 text-zinc-850',
    text: 'text-zinc-600',
    headerBg: 'bg-white/80 border-zinc-200 backdrop-blur-md',
    borderColor: 'border-zinc-200/90',
    cardBg: 'bg-white border-zinc-200/80 shadow-sm',
    innerBg: 'bg-zinc-100/50 border-zinc-250',
    accentColor: 'text-indigo-600',
    accentBg: 'bg-indigo-50 text-indigo-700 border-indigo-150',
    hoverBg: 'hover:bg-zinc-100 hover:border-zinc-300',
    badgeBg: 'bg-zinc-100 border-zinc-200 text-zinc-500',
    btnPrimary: 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-200/40 focus:ring-zinc-500/20',
    glow: 'from-indigo-600/2 to-transparent',
    textMuted: 'text-zinc-505 text-zinc-500',
    textHeading: 'text-zinc-900 font-bold',
    optionUnselected: 'bg-zinc-50/50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300 hover:text-zinc-900',
    optionSelected: 'bg-indigo-50/70 border-indigo-350 text-indigo-800 font-medium border-indigo-500'
  },
  // Theme 3: Organic Jade forest (Dark Forest)
  jade: {
    bg: 'bg-[#0b100d] text-stone-200',
    text: 'text-stone-300',
    headerBg: 'bg-[#111914]/60 border-emerald-950/30',
    borderColor: 'border-emerald-950/30',
    cardBg: 'bg-[#0f1712]/95 border-emerald-950/40 shadow-xl shadow-stone-950/10',
    innerBg: 'bg-[#070b09]/50 border-emerald-950/50',
    accentColor: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    hoverBg: 'hover:bg-[#121c16] hover:border-[#1c2e24]',
    badgeBg: 'bg-[#070b09] border-[#15251c] text-emerald-300/85',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40 focus:ring-emerald-500/20',
    glow: 'from-emerald-500/5 to-transparent',
    textMuted: 'text-stone-400',
    textHeading: 'text-white',
    optionUnselected: 'bg-[#070b09]/40 border-stone-850 text-stone-350 hover:bg-[#101b15]/60 hover:border-[#223d2e] hover:text-white',
    optionSelected: 'bg-emerald-650/15 border-emerald-500 text-emerald-300 shadow-emerald-950/15'
  },
  // Theme 4: Retro Amber (Amber terminal style)
  amber: {
    bg: 'bg-[#0a0907] text-amber-250 font-mono',
    text: 'text-amber-200/80',
    headerBg: 'bg-[#100e0b]/80 border-amber-950/40',
    borderColor: 'border-amber-950/40',
    cardBg: 'bg-[#12100d] border-amber-900/30 shadow-none',
    innerBg: 'bg-[#080705] border-amber-950/60',
    accentColor: 'text-amber-400',
    accentBg: 'bg-amber-950/50 text-amber-400 border-amber-900/30',
    hoverBg: 'hover:bg-[#191612] hover:border-amber-800/30',
    badgeBg: 'bg-[#070604] border-amber-950 text-amber-500/85',
    btnPrimary: 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold focus:ring-amber-500/20',
    glow: 'from-amber-500/2 to-transparent',
    textMuted: 'text-amber-500/60',
    textHeading: 'text-amber-400',
    optionUnselected: 'bg-[#070604]/40 border-amber-950 text-amber-200/70 hover:bg-[#191612] hover:border-amber-800/40 hover:text-amber-200',
    optionSelected: 'bg-amber-950/40 border-amber-500 text-amber-300'
  }
};

export default function App() {
  const [activeTheme, setActiveTheme] = useState<'slate' | 'zinc' | 'jade' | 'amber'>(() => {
    try {
      const savedTheme = localStorage.getItem('interactive_quiz_builder_theme') as any;
      if (savedTheme && THEMES[savedTheme]) return savedTheme;
    } catch {
      // ignore
    }
    return 'slate';
  });

  const [parsedResult, setParsedResult] = useState<ParserResult | null>(() => {
    try {
      const saved = localStorage.getItem('interactive_quiz_builder_parsed_file');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [settings, setSettings] = useState<QuizSettings>(() => {
    try {
      const saved = localStorage.getItem('interactive_quiz_builder_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          timeLimitPerQuestion: 0,
          shuffleQuestions: false,
          shuffleOptions: true,
          passingScore: 60,
          questionMode: 'all',
          subsetCount: 25,
          subsetOrder: 'random',
          solvingTemplate: 'slide',
          ...parsed,
        };
      }
    } catch {
      // ignore
    }
    return {
      timeLimitPerQuestion: 0, // unlimited
      shuffleQuestions: false,
      shuffleOptions: true,
      passingScore: 60,
      questionMode: 'all',
      subsetCount: 25,
      subsetOrder: 'random',
      solvingTemplate: 'slide',
    };
  });

  const quiz = useQuiz();

  // Theme auto-syncing
  useEffect(() => {
    try {
      localStorage.setItem('interactive_quiz_builder_theme', activeTheme);
    } catch (e) {
      console.error(e);
    }
    
    // Set dynamic attribute on element for extra power styling
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  // Sync state to local storage to survive reloads if the user has loaded questions
  useEffect(() => {
    try {
      if (parsedResult) {
        localStorage.setItem('interactive_quiz_builder_parsed_file', JSON.stringify(parsedResult));
      } else {
        localStorage.removeItem('interactive_quiz_builder_parsed_file');
      }
    } catch (e) {
      console.error(e);
    }
  }, [parsedResult]);

  useEffect(() => {
    try {
      localStorage.setItem('interactive_quiz_builder_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Load sample questions
  const handleLoadSample = (sampleQuestions: any[]) => {
    const virtualResult: ParserResult = {
      success: true,
      questions: sampleQuestions,
      fileName: "Sug'urta_Fani_Namuna_Testlar.xlsx (Sample Data)",
      fileSize: 45056,
      format: 'xlsx'
    };
    setParsedResult(virtualResult);
  };

  const handleFileUploadParsed = (result: ParserResult) => {
    setParsedResult(result);
  };

  const clearUploadedFile = () => {
    setParsedResult(null);
    quiz.resetQuiz();
    try {
      localStorage.removeItem('interactive_quiz_builder_parsed_file');
    } catch {
      // ignore
    }
  };

  const startQuizSession = () => {
    if (!parsedResult || parsedResult.questions.length === 0) return;
    quiz.startQuiz(parsedResult.questions, settings);
  };

  const handleRestartQuiz = () => {
    if (!parsedResult) return;
    quiz.startQuiz(parsedResult.questions, settings);
  };

  const t = THEMES[activeTheme];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${t.bg}`} id="app-root-container">
      {/* Ambient background accent */}
      {activeTheme !== 'zinc' && (
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full filter blur-[150px] pointer-events-none" />
      )}

      {/* Primary Navigation Header */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 ${t.headerBg}`} id="main-nav-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex flex-col sm:flex-row items-center justify-between py-2 sm:py-0 gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${
              activeTheme === 'jade' ? 'bg-gradient-to-tr from-emerald-600 to-emerald-500' :
              activeTheme === 'amber' ? 'bg-gradient-to-tr from-amber-600 to-amber-500 text-stone-950' :
              'bg-gradient-to-tr from-indigo-600 to-indigo-500'
            }`}>
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <h1 className={`font-sans font-extrabold text-sm sm:text-base tracking-tight ${t.textHeading}`}>
                Interactive Quiz Builder
              </h1>
              <p className={`text-[10px] font-mono tracking-wider font-semibold uppercase ${t.textMuted}`}>
                In-Browser Parser Portal
              </p>
            </div>
          </div>

          {/* Elegant Top Theme Switcher Tab - Yuqori Tabcha */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className={`flex items-center p-1 rounded-xl border ${activeTheme === 'zinc' ? 'bg-zinc-100 border-zinc-200' : 'bg-black/40 border-white/5'}`}>
              {(['slate', 'zinc', 'jade', 'amber'] as const).map((themeName) => {
                const isSelected = activeTheme === themeName;
                const labelUz = themeName === 'slate' ? 'Slate 🌑' :
                               themeName === 'zinc' ? 'Zinc ☀️' :
                               themeName === 'jade' ? 'Jade 🍃' : 'Amber 📟';
                return (
                  <button
                    key={themeName}
                    onClick={() => setActiveTheme(themeName)}
                    className={`px-3 py-1 font-sans text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? activeTheme === 'zinc'
                          ? 'bg-white text-zinc-900 shadow-sm font-black'
                          : activeTheme === 'jade'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/30'
                            : activeTheme === 'slate'
                              ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-900/30'
                              : 'bg-amber-950/60 text-amber-400 border border-amber-900/30'
                        : activeTheme === 'zinc'
                          ? 'text-zinc-500 hover:text-zinc-800'
                          : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {labelUz}
                  </button>
                );
              })}
            </div>

            <div className="h-6 w-[1px] bg-slate-800/40 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 border rounded-full px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider uppercase ${
                activeTheme === 'zinc' ? 'bg-zinc-100 border-zinc-200 text-zinc-650' : 'bg-black/30 border-white/5 text-slate-400'
              }`}>
                <Globe className={`w-3 h-3 ${t.accentColor}`} />
                SECURE
              </span>

              {parsedResult && quiz.state.status === 'idle' && (
                <button
                  onClick={clearUploadedFile}
                  className={`flex items-center gap-1.5 border transition-all text-xs font-semibold px-2.5 py-1 rounded-xl cursor-pointer ${
                    activeTheme === 'zinc'
                      ? 'bg-zinc-100 border-zinc-200 hover:bg-red-50 hover:border-red-200 text-zinc-700 hover:text-red-600'
                      : 'bg-black/30 border-white/5 hover:text-red-400 hover:border-red-950 text-slate-400'
                  }`}
                  id="btn-nav-clear"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Change File
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* VIEW 1: Idle (Upload State) */}
        {quiz.state.status === 'idle' && !parsedResult && (
          <div className="space-y-12 animate-fade-in" id="view-idle">
            {/* Visual Intro banner */}
            <div className="text-center max-w-2xl mx-auto space-y-4 pt-4">
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border transition-all ${t.accentBg}`}>
                <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-spin" /> In-Browser Test Engine
              </span>
              <h1 className={`font-sans font-black text-2xl sm:text-4xl tracking-tight leading-none ${t.textHeading}`}>
                Aralash formatli testlarni tezkor va qulay tahlil qiling.
              </h1>
              <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
                Upload any standard question spreadsheet or Word document. Parses entirely inside your client browser, with no servers or privacy leaks. Perfect for local teacher verification.
              </p>
            </div>

            {/* Uploader module */}
            <div className="max-w-2xl mx-auto">
              <FileUploader onParsed={handleFileUploadParsed} theme={t} />
            </div>

            {/* Formatting guides & live sample activator */}
            <div className="max-w-4xl mx-auto">
              <TemplateFormatTips onLoadSample={handleLoadSample} theme={t} />
            </div>
          </div>
        )}

        {/* VIEW 2: Configuration & Preview State (Idle, with parsed questions) */}
        {quiz.state.status === 'idle' && parsedResult && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" id="view-config">
            {/* Left side: Upload Stats and Question Inspector */}
            <div className="lg:col-span-2 space-y-6">
              {/* File Info Alert card */}
              <div className={`border rounded-3xl p-6 shadow-sm flex items-start gap-4 text-left ${t.cardBg}`}>
                <div className={`p-4 rounded-xl border ${
                  parsedResult.format === 'xlsx' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-sky-500/10 border-sky-500/20 text-sky-500'
                }`}>
                  {parsedResult.format === 'xlsx' ? (
                    <FileSpreadsheet className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>

                <div className="space-y-1.5 text-left flex-1 min-w-0">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${t.badgeBg}`}>
                    {parsedResult.format === 'xlsx' ? 'EXCEL SPREADSHEET' : 'WORD FILE'}
                  </span>
                  <h3 className={`font-sans font-bold text-sm sm:text-base truncate ${t.textHeading}`}>
                    {parsedResult.fileName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    File size: <strong className="text-slate-350 select-none">{(parsedResult.fileSize / 1024).toFixed(1)} KB</strong> • Extracted structure containing <strong className="text-emerald-500">{parsedResult.questions.length}</strong> valid questions.
                  </p>
                </div>
              </div>

              {/* Collapsible Questions List Inspector */}
              <div className={`border rounded-3xl p-6 shadow-sm space-y-4 ${t.cardBg}`}>
                <div className="flex items-center justify-between border-b border-slate-500/10 pb-3">
                  <h3 className={`font-sans font-bold text-sm tracking-tight ${t.textHeading}`}>
                    Savollar ro&apos;yxati / Question Preview
                  </h3>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-lg font-mono font-bold ${t.badgeBg}`}>
                    {parsedResult.questions.length} items
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed text-left">
                  Verify the list of imported questions below before starting the trivia testing loop. Each correct option will be scrambled natively.
                </p>

                {/* Vertical question feed list */}
                <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-500/10 pr-1 space-y-3 pt-2" id="verified-items-feed shadow-inner">
                  {parsedResult.questions.map((q, idx) => (
                    <div key={q.id} className="pt-3 first:pt-0 text-left space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-[11px] font-mono font-bold ${t.accentColor}`}>#{idx + 1}</span>
                        <h4 className="font-sans text-xs font-semibold text-slate-350 leading-normal">
                          {q.questionText}
                        </h4>
                      </div>

                      <div className="pl-5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-400">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = opt === q.correctAnswer;
                          return (
                            <div key={oIdx} className="flex items-center gap-1.5 truncate">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCorrect ? 'bg-emerald-500' : 'bg-slate-500/40'}`} />
                              <span className={isCorrect ? 'text-emerald-500 font-semibold' : ''}>{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <p className="pl-5 text-[10px] italic text-slate-500 line-clamp-1">
                          Izoh: {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: Session configuration console & CTA */}
            <div className="space-y-6" id="config-panel-column">
              <div className={`border rounded-3xl p-6 shadow-sm space-y-6 text-left ${t.cardBg}`}>
                <div className="flex items-center gap-2 border-b border-slate-500/10 pb-4">
                  <Settings className={`w-5 h-5 ${t.accentColor}`} />
                  <h3 className={`font-sans font-bold text-sm tracking-tight ${t.textHeading}`}>
                    Test Sozlamalari / Configuration
                  </h3>
                </div>

                {/* Settings Input Grid */}
                <div className="space-y-5 text-xs">
                  {/* Test Turi / Question Count Selection */}
                  <div className={`space-y-3 p-4 rounded-2xl border ${t.innerBg} ${t.borderColor}`} id="settings-slice-card">
                    <div className="flex justify-between items-baseline">
                      <p className="font-black text-xs">Test hajmi / Question Volume</p>
                      <span className={`font-mono text-[10px] font-bold ${t.accentColor}`}>
                        {settings.questionMode === 'all' ? `Barchasi (${parsedResult?.questions.length || 0} ta)` : `${settings.subsetCount} ta test`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, questionMode: 'all' })}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          settings.questionMode === 'all'
                            ? activeTheme === 'zinc' ? 'bg-zinc-900 text-white border-zinc-900' : `${t.accentBg} font-black`
                            : 'bg-transparent border-slate-500/10 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Hammasi (All)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, questionMode: 'subset' })}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          settings.questionMode === 'subset'
                            ? activeTheme === 'zinc' ? 'bg-zinc-900 text-white border-zinc-900 font-black' : `${t.accentBg} font-black`
                            : 'bg-transparent border-slate-500/10 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Qisqartirish (Slice)
                      </button>
                    </div>

                    {settings.questionMode === 'subset' && (
                      <div className="space-y-2.5 pt-1.5 animate-fade-in text-left">
                        <p className="text-[10px] text-slate-400 font-semibold">Savollar sonini tanlang yoki o&apos;zingiz yozing:</p>
                        <div className="flex gap-2 items-center">
                          {[10, 25, 50].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setSettings({ ...settings, subsetCount: num })}
                              className={`py-1.5 px-3 rounded-xl border text-[10px] font-bold cursor-pointer transition-colors ${
                                settings.subsetCount === num
                                  ? activeTheme === 'zinc' ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                                  : 'bg-transparent border-slate-500/10 text-slate-400 hover:border-slate-500/30'
                              }`}
                            >
                              {num} ta
                            </button>
                          ))}
                          <div className="relative flex-1 min-w-0">
                            <input
                              type="number"
                              min={1}
                              max={parsedResult?.questions.length || 100}
                              value={settings.subsetCount || 25}
                              onChange={(e) => setSettings({ ...settings, subsetCount: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                              className={`w-full text-[11px] font-mono font-bold text-center py-1.5 pr-6 pl-2 rounded-xl transition-all select-all focus:outline-none focus:ring-1 ${
                                activeTheme === 'zinc'
                                  ? 'bg-zinc-100 border border-zinc-200 text-zinc-900 focus:ring-zinc-400'
                                  : 'bg-slate-950/40 border border-slate-700/30 text-slate-200 focus:ring-indigo-500'
                              }`}
                            />
                            <span className="absolute right-2 top-0 bottom-0 flex items-center text-[10px] text-slate-500 font-bold select-none pointer-events-none">ta</span>
                          </div>
                        </div>

                        {/* Order pick within slice */}
                        <div className="pt-2 flex items-center justify-between border-t border-slate-500/5">
                          <span className="text-[10px] text-slate-400 font-semibold">Tanlab olish uslubi:</span>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSettings({ ...settings, subsetOrder: 'sequential' })}
                              className={`px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold tracking-wider uppercase border cursor-pointer transition-colors ${
                                settings.subsetOrder === 'sequential'
                                  ? activeTheme === 'zinc' ? 'bg-zinc-200 text-zinc-900 border-zinc-300' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                                  : 'border-transparent text-slate-500 hover:text-slate-400'
                              }`}
                            >
                              Ketma-ket
                            </button>
                            <button
                              type="button"
                              onClick={() => setSettings({ ...settings, subsetOrder: 'random' })}
                              className={`px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold tracking-wider uppercase border cursor-pointer transition-colors ${
                                settings.subsetOrder === 'random'
                                  ? activeTheme === 'zinc' ? 'bg-zinc-200 text-zinc-900 border-zinc-300' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                                  : 'border-transparent text-slate-500 hover:text-slate-400'
                              }`}
                            >
                              Tasodifiy
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Test yechish ko&apos;rinishi shabloni / Solving Layout Template */}
                  <div className={`space-y-3 p-4 rounded-xl border ${t.innerBg} ${t.borderColor}`} id="settings-template-card">
                    <p className="font-black text-xs">Yechish shabloni / Solving Template</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, solvingTemplate: 'slide' })}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between min-h-[76px] transition-all cursor-pointer ${
                          settings.solvingTemplate === 'slide'
                            ? activeTheme === 'zinc' ? 'bg-zinc-900 border-zinc-900 text-white' : `${t.accentBg} font-bold`
                            : 'bg-transparent border-slate-500/10 text-slate-450 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Bitta-bitta (Slide)</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${settings.solvingTemplate === 'slide' ? 'bg-indigo-455 bg-indigo-500' : 'bg-slate-600'}`} />
                        </div>
                        <p className={`text-[9px] leading-normal pt-1 ${settings.solvingTemplate === 'slide' ? 'text-slate-300' : 'text-slate-400'}`}>
                          Savollar biri ketidan biri, timed bar va focused progress bilan chiqadi.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, solvingTemplate: 'scroll' })}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between min-h-[76px] transition-all cursor-pointer ${
                          settings.solvingTemplate === 'scroll'
                            ? activeTheme === 'zinc' ? 'bg-zinc-900 border-zinc-900 text-white' : `${t.accentBg} font-bold`
                            : 'bg-transparent border-slate-500/10 text-slate-455 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[10px] font-bold uppercase tracking-wider font-sans font-black">Scroll List (Uzun)</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${settings.solvingTemplate === 'scroll' ? 'bg-indigo-455 bg-indigo-500' : 'bg-slate-600'}`} />
                        </div>
                        <p className={`text-[9px] leading-normal pt-1 ${settings.solvingTemplate === 'scroll' ? 'text-slate-300' : 'text-slate-400'}`}>
                          Barcha testlarni bitta listda pastga ko&apos;rib ketasiz, xarita orqali tezkor o&apos;tiladi.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Shuffle questions */}
                  <div className={`flex items-center justify-between p-3.5 rounded-xl border ${t.innerBg} ${t.borderColor}`}>
                    <div>
                      <p className="font-bold">Aralashtirish / Shuffle questions</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Scramble questions chronological orders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={settings.shuffleQuestions}
                        onChange={(e) => setSettings({ ...settings, shuffleQuestions: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-slate-350 bg-slate-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-650 peer-checked:bg-indigo-600 peer-checked:after:bg-white" />
                    </label>
                  </div>

                  {/* Shuffle options */}
                  <div className={`flex items-center justify-between p-3.5 rounded-xl border ${t.innerBg} ${t.borderColor}`}>
                    <div>
                      <p className="font-bold">Variantlarni aralashtirish / Shuffle options</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Change A, B, C positions for each question</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={settings.shuffleOptions}
                        onChange={(e) => setSettings({ ...settings, shuffleOptions: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-slate-355 bg-slate-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-650 peer-checked:bg-indigo-600 peer-checked:after:bg-white" />
                    </label>
                  </div>

                  {/* Question Time limits */}
                  <div className={`space-y-2 p-4 rounded-xl border ${t.innerBg} ${t.borderColor}`}>
                    <div className="flex justify-between items-baseline">
                      <p className="font-bold">Vaqt cheklovi / Question Time Limit</p>
                      <span className={`font-mono text-[11px] font-bold ${t.accentColor}`}>
                        {settings.timeLimitPerQuestion === 0 ? 'Cheksiz' : `${settings.timeLimitPerQuestion} s`}
                      </span>
                    </div>
                    <select
                      value={settings.timeLimitPerQuestion}
                      onChange={(e) => setSettings({ ...settings, timeLimitPerQuestion: parseInt(e.target.value, 10) })}
                      className="w-full bg-transparent border border-slate-500/20 text-slate-300 hover:border-slate-500/40 px-3 py-2 rounded-xl transition-all font-sans text-xs focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value={0} className="bg-slate-900 text-slate-300">Cheklovsiz / No Limit</option>
                      <option value={15} className="bg-slate-900 text-slate-300">15 soniya / 15 seconds</option>
                      <option value={30} className="bg-slate-900 text-slate-300">30 soniya / 30 seconds</option>
                      <option value={45} className="bg-slate-900 text-slate-300">45 soniya / 45 seconds</option>
                      <option value={60} className="bg-slate-900 text-slate-300">1 daqiqa / 60 seconds</option>
                      <option value={120} className="bg-slate-900 text-slate-300">2 daqiqa / 120 seconds</option>
                    </select>
                  </div>

                  {/* Passing Score Slider */}
                  <div className={`space-y-2 p-4 rounded-xl border ${t.innerBg} ${t.borderColor}`}>
                    <div className="flex justify-between items-baseline">
                      <p className="font-bold">O&apos;tish bali / Passing Score</p>
                      <span className={`font-mono text-[11px] font-bold ${t.accentColor}`}>{settings.passingScore}% minimum</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="90"
                      step="5"
                      value={settings.passingScore}
                      onChange={(e) => setSettings({ ...settings, passingScore: parseInt(e.target.value, 10) })}
                      className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-indigo-550"
                    />
                    <div className="flex justify-between text-[10px] text-slate-550 text-slate-500 font-semibold">
                      <span>30% Qulay</span>
                      <span>60% Mumtoz</span>
                      <span>90% Mukammal</span>
                    </div>
                  </div>
                </div>

                {/* Play Trigger */}
                <button
                  onClick={startQuizSession}
                  className={`w-full flex items-center justify-center gap-2 font-sans font-bold text-xs py-4 rounded-2xl transition-all cursor-pointer ${t.btnPrimary}`}
                  id="btn-trigger-start"
                >
                  <Play className="w-4 h-4 fill-current text-white shrink-0" />
                  Testni boshlash / Launch Quiz Game
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: Active Testing Module */}
        {quiz.state.status === 'playing' && quiz.currentQuestion && (
          <div className="animate-fade-in" id="view-playing">
            <QuizWrapper
              state={quiz.state}
              currentQuestion={quiz.currentQuestion}
              currentQuestionResponse={quiz.currentQuestionResponse}
              currentQuestionTimeSpent={quiz.currentQuestionTimeSpent}
              selectOption={quiz.selectOption}
              nextQuestion={quiz.nextQuestion}
              prevQuestion={quiz.prevQuestion}
              jumpToQuestion={quiz.jumpToQuestion}
              pauseQuiz={quiz.pauseQuiz}
              resumeQuiz={quiz.resumeQuiz}
              submitQuiz={quiz.submitQuiz}
              theme={t}
            />
          </div>
        )}

        {/* VIEW 4: Frosted Paused Overlay */}
        {quiz.state.status === 'paused' && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" id="overlay-paused">
            <div className={`border rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl relative ${t.cardBg}`}>
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mx-auto border border-indigo-500/20">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-1">
                <h3 className={`font-sans font-bold text-lg ${t.textHeading}`}>Test To&apos;xtatildi / Quiz Paused</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Your answers and temporal clock are frozen safely. Click resume to restore testing.
                </p>
              </div>

              {/* Snapshot metrics */}
              <div className={`grid grid-cols-2 gap-3 border rounded-2xl p-4 text-xs ${t.innerBg}`}>
                <div className="text-left font-sans">
                  <span className="text-slate-500 text-[9px] uppercase font-mono font-bold">Elapsed</span>
                  <p className={`font-mono text-sm font-black mt-0.5 ${t.textHeading}`}>
                    {Math.floor(quiz.state.totalElapsedTime / 60)}m {quiz.state.totalElapsedTime % 60}s
                  </p>
                </div>
                <div className="text-left font-sans">
                  <span className="text-slate-500 text-[9px] uppercase font-mono font-bold">Solved</span>
                  <p className={`font-mono text-sm font-black mt-0.5 ${t.textHeading}`}>
                    {Object.keys(quiz.state.userResponses).length} / {quiz.state.questions.length} items
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={quiz.resumeQuiz}
                  className={`w-full py-3 text-white font-sans text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md ${t.btnPrimary}`}
                  id="btn-resume-quiz-overlay"
                >
                  Davom ettirish / Resume Quiz
                </button>
                <button
                  onClick={quiz.resetQuiz}
                  className={`w-full py-3 border text-slate-400 hover:text-red-400 font-sans text-xs font-semibold rounded-xl transition-all cursor-pointer ${t.innerBg}`}
                  id="btn-cancel-quiz-overlay"
                >
                  Testni tugatish / End Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: Completed Analytics Dashboard */}
        {quiz.state.status === 'completed' && (
          <div className="animate-fade-in" id="view-completed">
            <AnalyticsDashboard
              getResultsSummary={quiz.getResultsSummary}
              onRestart={handleRestartQuiz}
              onBackToUpload={clearUploadedFile}
              theme={t}
            />
          </div>
        )}
      </main>

      {/* Aesthetic Footer */}
      <footer className={`border-t py-6 mt-12 text-center text-xs text-slate-500 transition-colors duration-300 ${t.headerBg}`} id="main-footer-panel">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans select-none tracking-tight">
            © 2026 Interactive Quiz Builder. Created client-side completely.
          </p>

          <div className="flex gap-4 font-mono text-[10px] uppercase font-bold text-slate-500">
            <span>Security First • No Cookies • High Contrast</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
