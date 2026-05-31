import { useState } from 'react';
import { FileSpreadsheet, FileText, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { Question } from '../types/quiz';
import { ThemeConfig } from '../App';

// Mock/Sample high-quality Quiz questions to let users try the system instantly
export const SAMPLE_QUIZ_QUESTIONS: Question[] = [
  {
    id: "sample-1",
    number: 1,
    questionText: "Sug'urtaning iqtisodiy mohiyati va funksiyalari, sug'urta tarif siyosati, sug'urta bozorining asosiy tamoyillari, respublikamiz sug'urta kompaniyalari tomonidan taqdim qilinadigan sug'urta turlari sug'urta kompaniyasi faoliyatini tashkil etishning huquqiy asoslari, sug'urta shartnomasi tuzish uslublari, sug'urta ishini tashkil etish, hayot sug'urtasi kabi mavzular bo'yicha talabalarga bilim, malaka va ko'nikmalar shakllantirish \"Sug'urta\" fanini o'qitishning nimasi hisoblanadi?",
    options: ["Vazifasi", "Maqsadi", "Predmeti", "Metodlari"],
    correctAnswer: "Vazifasi",
    explanation: "Fanning vazifasi - talabalarga fanning mohiyati, tamoyillari, turlari va huquqiy asoslari bo'yicha tizimli bilim va ko'nikmalarni shakllantirishdan iborat."
  },
  {
    id: "sample-2",
    number: 2,
    questionText: "Sug'urta obyektlarining turlari nechta va umi qaysilar?",
    options: [
      "3 ta; shaxsiy sug'urta, mulkiy sug'urta, javobgarlik sug'urta",
      "3 ta; majburiy sug'urta, mulkiy sug'urta, javobgarlik sug'urta",
      "3 ta; ixtiyoriy sug'urta, mulkiy sug'urta, javobgarlik subyektlar",
      "3 ta; hayot sug'urtasi, mulkiy sug'urta, javobgarlik sug'urta"
    ],
    correctAnswer: "3 ta; shaxsiy sug'urta, mulkiy sug'urta, javobgarlik sug'urta",
    explanation: "O'zbekiston Respublikasi qonunchiligiga ko'ra sug'urta turlari asosiy uchta guruhga bo'linadi: shaxsiy, mulkiy va javobgarlik."
  },
  {
    id: "sample-3",
    number: 3,
    questionText: "Sug'urta munosabatlarining ishtirokchilari kimlar hisoblanadi?",
    options: [
      "sug'urtalovchi va sug'urtalanuvchi",
      "sug'urta tashkilotlari",
      "sug'urtalanuvchi subyektlar",
      "xo'jalik yurituvchi subyektlar"
    ],
    correctAnswer: "sug'urtalovchi va sug'urtalanuvchi",
    explanation: "Sug'urtaning ikki asosiy tomoni bo'lib, ular sug'urtalovchi (kompaniya) va sug'urtalanuvchi (mijoz) hisoblanadi."
  },
  {
    id: "sample-4",
    number: 4,
    questionText: "Sug'urtaning funksiyalari to'g'ri berilgan qatorni toping?",
    options: [
      "xavf-xatar, ogohlantirish, investitsiya, omonat, axborot, nazorat",
      "tavakkalchilik, ogohlantirish, investitsiya, omonat, axborot, nazorat",
      "risk, ogohlantirish, investitsiya, omonat, axborot, nazorat",
      "ijtimoiy yordam, ogohlantirish, investitsiya, omonat, axborot, nazorat"
    ],
    correctAnswer: "xavf-xatar, ogohlantirish, investitsiya, omonat, axborot, nazorat",
    explanation: "Sug'urtaning iqtisodiy tabiati uning xavf-xatarlarni bartaraf etish, ogohlantirish hamda moliyaviy barqarorlikni ta'minlovchi funksiyalarida namoyon bo'ladi."
  },
  {
    id: "sample-5",
    number: 5,
    questionText: "React framworkida komponent turlari qaysilar?",
    options: [
      "Funksional va Klass komponentlar",
      "Modulli va Dinamik komponentlar",
      "Statik va Kontekst komponentlar",
      "Skanerli va Grafik komponentlar"
    ],
    correctAnswer: "Funksional va Klass komponentlar",
    explanation: "React components are primarily written as functional components with hooks, or legacy class components."
  }
];

interface TemplateFormatTipsProps {
  onLoadSample: (questions: Question[]) => void;
  theme?: ThemeConfig;
}

export default function TemplateFormatTips({ onLoadSample, theme }: TemplateFormatTipsProps) {
  const [activeTab, setActiveTab] = useState<'xlsx' | 'docx'>('xlsx');

  // Default theme slate
  const t = theme || {
    bg: 'bg-slate-950 text-slate-100',
    text: 'text-slate-300',
    headerBg: 'bg-slate-900/40 border-slate-900',
    borderColor: 'border-slate-800/80',
    cardBg: 'bg-slate-900/90 border-slate-800',
    innerBg: 'bg-slate-950/40 border-slate-850',
    accentColor: 'text-indigo-400',
    accentBg: 'bg-indigo-505/10 text-indigo-404 border-indigo-550/15',
    hoverBg: 'hover:bg-slate-900/90 hover:border-slate-700',
    badgeBg: 'bg-slate-950/70 border-slate-850 text-slate-400',
    btnPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40',
    glow: 'from-indigo-500/5 to-transparent',
    textMuted: 'text-slate-400',
    textHeading: 'text-white',
    optionUnselected: 'bg-slate-950/40 border-slate-850 text-slate-300',
    optionSelected: 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-indigo-950/20'
  };

  const isJade = t.accentColor.includes('emerald');
  const sampleBtnClass = isJade 
    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40' 
    : theme?.btnPrimary.includes('zinc')
      ? 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-200/40'
      : theme?.btnPrimary.includes('amber')
        ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold'
        : 'bg-indigo-600 hover:bg-indigo-550 text-white shadow-indigo-950/40';

  return (
    <div className={`border rounded-3xl overflow-hidden shadow-sm font-sans ${t.cardBg} ${t.borderColor}`} id="template-format-tips">
      {/* Header Panel */}
      <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left ${t.headerBg} ${t.borderColor}`}>
        <div className="space-y-1">
          <h3 className={`font-sans font-black text-base sm:text-lg tracking-tight ${t.textHeading}`}>
            Qo&apos;llab-quvvatlanadigan fayl turlari va andozalar
          </h3>
          <p className="text-slate-400 text-xs font-sans">
            Kutubxonalarsiz, to&apos;g&apos;ridan-to&apos;g&apos;ri brauzerning o&apos;zida tahlil qilinadi.
          </p>
        </div>

        <button
          onClick={() => onLoadSample(SAMPLE_QUIZ_QUESTIONS)}
          className={`flex items-center justify-center gap-2 font-sans text-xs font-bold px-4 py-3 rounded-2xl transition-all cursor-pointer shadow-md shrink-0 ${sampleBtnClass}`}
          id="btn-try-sample"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Namuna yuklash / Try Live Demo
        </button>
      </div>

      {/* Tabs */}
      <div className={`flex border-b text-xs font-semibold ${t.innerBg} ${t.borderColor}`}>
        <button
          onClick={() => setActiveTab('xlsx')}
          className={`flex-1 py-3.5 px-4 text-xs font-sans font-bold tracking-tight border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'xlsx'
              ? `border-indigo-500 ${t.accentColor} font-black`
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
          id="tab-xlsx"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Excel Jadval (.xlsx)
        </button>
        <button
          onClick={() => setActiveTab('docx')}
          className={`flex-1 py-3.5 px-4 text-xs font-sans font-bold tracking-tight border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'docx'
              ? `border-indigo-500 ${t.accentColor} font-black`
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
          id="tab-docx"
        >
          <FileText className="w-4 h-4" />
          Word Matn (.docx / word/pdf)
        </button>
      </div>

      {/* Content Container */}
      <div className="p-6 text-left">
        {activeTab === 'xlsx' ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border text-left ${t.innerBg} ${t.borderColor}`}>
              <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase mb-2 ${t.accentBg}`}>
                O&apos;ZBEKISTON STANDARTI JADVALI (SHeetJS)
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Taqdim etilgan Excel faylida har safar <strong>To&apos;g&apos;ri javob A (Col C)</strong> ustunida bo&apos;lishi kerak, qolgan ustunlar esa noto&apos;g&apos;ri javoblar (B, C, D) hisoblanadi. Test boshlanganda variantlar avtomatik ravishda aralashtiriladi, shuning uchun foydalanuvchida hech qachon doimiy &quot;A&quot; variant to&apos;g&apos;ri javob bo&apos;lib qolmaydi!
              </p>
            </div>

            {/* Simulated Grid Preview */}
            <div className={`overflow-x-auto border rounded-2xl ${t.borderColor}`} id="grid-xlsx-preview">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className={`border-b ${t.innerBg} ${t.borderColor}`}>
                    <th className={`p-3 font-bold text-slate-300 border-r ${t.borderColor}`}>№</th>
                    <th className={`p-3 font-bold text-slate-300 border-r min-w-[200px] ${t.borderColor}`}>Savol matni (Question)</th>
                    <th className={`p-3 font-bold text-emerald-400 border-r min-w-[125px] bg-emerald-500/5 ${t.borderColor}`}>To&apos;g&apos;ri javob A (Correct)</th>
                    <th className={`p-3 font-bold text-rose-450 text-rose-400 border-r min-w-[125px] ${t.borderColor}`}>Noto&apos;g&apos;ri javob B</th>
                    <th className={`p-3 font-bold text-rose-450 text-rose-400 border-r min-w-[125px] ${t.borderColor}`}>Noto&apos;g&apos;ri javob C</th>
                    <th className="p-3 font-bold text-rose-450 text-rose-400 min-w-[125px]">Noto&apos;g&apos;ri javob D</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-slate-400 ${t.borderColor}`}>
                  <tr>
                    <td className={`p-3 border-r font-mono font-bold ${t.borderColor}`}>1</td>
                    <td className={`p-3 border-r text-slate-300 ${t.borderColor}`}>Sug&apos;urta obyektining turlari nechta?</td>
                    <td className={`p-3 border-r bg-emerald-500/5 text-emerald-350 font-semibold ${t.borderColor}`}>3 ta; shaxsiy, mulkiy, javobgarlik</td>
                    <td className={`p-3 border-r ${t.borderColor}`}>2 ta; majburiy, mulkiy</td>
                    <td className={`p-3 border-r ${t.borderColor}`}>4 ta; ixtiyoriy, davlat</td>
                    <td className="p-3">5 ta; aralash, maxsus</td>
                  </tr>
                  <tr>
                    <td className={`p-3 border-r font-mono font-bold ${t.borderColor}`}>2</td>
                    <td className={`p-3 border-r text-slate-300 ${t.borderColor}`}>React komponentining asosiy holat boshqaruvchisi?</td>
                    <td className={`p-3 border-r bg-emerald-500/5 text-emerald-350 font-semibold ${t.borderColor}`}>useState</td>
                    <td className={`p-3 border-r ${t.borderColor}`}>useEffect</td>
                    <td className={`p-3 border-r ${t.borderColor}`}>useMemo</td>
                    <td className="p-3">useCallback</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className={`font-sans font-bold text-xs ${t.textHeading}`}>Muqobil variantlar (Headers):</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 font-sans">
                <li className="flex items-start gap-2">
                  <span className={`${t.accentColor} mt-0.5 font-bold`}>•</span>
                  <span>Ustun sarlavhalari ixtiyoriy: <code>Savol</code>, <code>To'g'ri</code>, <code>VariantB</code> ... deb nomlanishi ham mumkin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${t.accentColor} mt-0.5 font-bold`}>•</span>
                  <span>Xavfsiz va aniq parsing uchun jadvalni ushbu tuzilmaga yaqin holatda qiling.</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl border text-left ${t.innerBg} ${t.borderColor}`}>
                <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase mb-2 ${t.accentBg}`}>
                  ANDANDOZA A: YULDUZCHA (ASTERISK) USULI
                </span>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Savollar raqamlar bilan boshlanadi. Variantlar harflar bilan boshlanib, to&apos;g&apos;ri variant matnidan oldin yulduzcha <strong><code>*</code></strong> belgisi qo&apos;yiladi. Masalan: <code>b) *sugʻurta</code>.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border text-left ${t.innerBg} ${t.borderColor}`}>
                <span className="inline-flex px-2.5 py-0.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase mb-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ANDANDOZA B: AJRATILGAN BLOKLAR (+++++ / =====)
                </span>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Savollarni <strong><code>+++++</code></strong> qatori bilan ajrating. Variantlarni esa <strong><code>=====</code></strong> qatori bilan ajratib, to&apos;g&apos;ri javob oldiga <strong><code>#</code></strong> belgisini qo&apos;ying.
                </p>
              </div>
            </div>

            {/* Text Area Preview representing DOCX */}
            <div className={`rounded-2xl border p-5 font-mono text-xs leading-relaxed space-y-4 text-left shadow-inner ${t.innerBg} ${t.borderColor}`}>
              <div>
                <p className={`${t.accentColor} font-bold`}>// 1-Andoza: Yulduzcha usulidagi ko&apos;rinishi</p>
                <p className={`${t.textHeading}`}>1. Mol-mulk, sogʻliq yoki hayot sugʻurtasi nima deyiladi?</p>
                <p className="pl-4 text-slate-400">a) moliya</p>
                <p className="pl-4 text-emerald-400 font-medium">b) *sugʻurta</p>
                <p className="pl-4 text-slate-400">c) bank</p>
                <p className="pl-4 text-slate-400">d) soliq</p>
              </div>

              <hr className={`border-t ${t.borderColor} opacity-50`} />

              <div>
                <p className="text-emerald-400 font-bold">// 2-Andoza: Ajratilgan bloklar (PDF formati)</p>
                <p className={`${t.textHeading}`}>Buxgalteriya balansida aks ettiriladigan foyda ko&apos;rsatkichini ko&apos;rsating</p>
                <p className="text-slate-500">=====</p>
                <p className="text-emerald-400 font-medium"># taqsimlanmagan foyda.</p>
                <p className="text-slate-500 font-semibold">=====</p>
                <p className="text-slate-450 text-slate-400">yalpi foyda.</p>
                <p className="text-slate-500 font-semibold">=====</p>
                <p className="text-slate-450 text-slate-400">umumxo&apos;jalik faoliyati foydasi.</p>
                <p className="text-slate-400 mt-2 font-bold">+++++</p>
                <p className={`${t.textHeading}`}>Tahlil so&apos;zining lug&apos;aviy mazmuni nimani anglatadi?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400 text-left font-sans">
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Harf orqali tanib olish: a), b), c), d) yoki A), B), C), D)</span>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5 text-emerald-400" />
                <span>Word yoki oddiy txt matndan ko&apos;chirib olingan testlarni ham tahlil qiladi</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
