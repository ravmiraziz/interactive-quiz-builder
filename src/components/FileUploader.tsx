import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileSpreadsheet, FileText, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { parseXLSX, parseDOCX, formatFileSize } from '../utils/parsers';
import { ParserResult } from '../types/quiz';
import { ThemeConfig } from '../App';

interface FileUploaderProps {
  onParsed: (result: ParserResult) => void;
  theme?: ThemeConfig;
}

export default function FileUploader({ onParsed, theme }: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ name: string; count: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback defaults representing 'slate' style tokens
  const t = theme || {
    bg: 'bg-slate-950 text-slate-100',
    text: 'text-slate-300',
    headerBg: 'bg-slate-900/60 border-slate-900',
    borderColor: 'border-slate-800/80',
    cardBg: 'bg-slate-900/90 border-slate-800/80',
    innerBg: 'bg-slate-950/40 border-slate-850',
    accentColor: 'text-indigo-400',
    accentBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    hoverBg: 'hover:bg-slate-900/90 hover:border-slate-700',
    badgeBg: 'bg-slate-950/70 border-slate-850 text-slate-400',
    btnPrimary: 'bg-indigo-600 hover:bg-indigo-505 bg-indigo-550 hover:bg-indigo-500 text-white shadow-indigo-950/40 focus:ring-indigo-500/20',
    glow: 'from-indigo-500/5 to-transparent',
    textMuted: 'text-slate-400',
    textHeading: 'text-white',
    optionUnselected: 'bg-slate-950/40 border-slate-850 text-slate-300 hover:bg-slate-950/80 hover:border-slate-705 hover:text-white',
    optionSelected: 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-indigo-950/20'
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension !== 'xlsx' && extension !== 'docx') {
      setError(`Format noto'g'ri / Unsupported Format: Only Excel (.xlsx) and Word (.docx) files are supported.`);
      setSuccessInfo(null);
      return;
    }

    setIsParsing(true);
    setError(null);
    setSuccessInfo(null);

    try {
      let result: ParserResult;
      
      if (extension === 'xlsx') {
        result = await parseXLSX(file);
      } else {
        result = await parseDOCX(file);
      }

      setIsParsing(false);

      if (result.success) {
        setSuccessInfo({
          name: file.name,
          count: result.questions.length,
        });
        onParsed(result);
      } else {
        setError(result.error || 'Faylni o‘qishda muammo yuz berdi. Fayl strukturasi to‘g‘riligini tekshiring.');
      }
    } catch (e: any) {
      setIsParsing(false);
      setError(`Kutilmagan xatolik / Unresolved parsing error: ${e.message || 'Error parsing test content.'}`);
    }
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4 font-sans" id="file-uploader-module">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer select-none group overflow-hidden ${
          isDragActive
            ? 'border-indigo-400 bg-indigo-500/10 shadow-lg scale-[1.01]'
            : `${t.borderColor} ${t.cardBg} hover:opacity-100 hover:scale-[1.005]`
        }`}
        id="uploader-drop-zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .docx"
          onChange={handleFileChange}
          className="hidden"
          id="uploader-file-input"
        />

        {/* Ambient Gradient Background Glow */}
        <div className={`absolute inset-0 bg-gradient-to-b ${t.glow} pointer-events-none`} />

        <div className="relative space-y-5">
          {/* Icons container */}
          <div className="flex justify-center items-center gap-4">
            <div className={`p-4 rounded-2xl transition-all duration-300 ${
              isDragActive ? 'bg-indigo-500/20 text-indigo-400 scale-110' : `${t.innerBg} text-slate-405 group-hover:text-indigo-400`
            }`}>
              <Upload className="w-7 h-7" />
            </div>

            <div className="flex flex-col gap-0.5 text-left opacity-40 group-hover:opacity-80 transition-opacity font-mono">
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-500">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span>EXCEL (.xlsx)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-sky-500">
                <FileText className="w-3.5 h-3.5 text-sky-500" />
                <span>WORD (.docx)</span>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-2 text-center">
            <h3 className={`font-sans font-black text-base sm:text-lg tracking-tight transition-colors ${t.textHeading}`}>
              Faylni tanlash yoki sudrab keltirish
            </h3>
            <p className="font-sans text-xs sm:text-sm text-slate-400 leading-normal">
              Kompyuterdan <strong className="text-emerald-500">Excel (.xlsx)</strong> yoki <strong className="text-sky-550 text-sky-500 font-sans font-bold">Word (.docx)</strong> faylini tanlang yoki shu yerga sudrab keltiring.
            </p>
          </div>

          <div className={`flex justify-center items-center gap-4 text-[9px] font-mono tracking-wider font-bold uppercase pt-2 ${t.textMuted}`}>
            <span>MAX SIZE: 15MB</span>
            <span className="w-1 h-1 bg-slate-500/30 rounded-full" />
            <span>NATIVE PARSING</span>
          </div>
        </div>
      </div>

      {/* Parser state loaders/alerts */}
      {isParsing && (
        <div className={`flex items-center gap-3 p-4 border rounded-2xl animate-pulse ${t.cardBg}`} id="uploader-loading-state">
          <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
          <div className="text-left">
            <p className={`text-xs font-semibold ${t.textHeading}`}>Fayl tahlil qilinmoqda...</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Reading contents client-side via in-browser parsers...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-950/20 border border-red-950/60 rounded-2xl" id="uploader-error-state">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-xs font-semibold text-red-400 font-sans">Tahlil qilishda xatolik yuz berdi</p>
            <p className="text-xs text-slate-350 mt-1 leading-relaxed font-sans">{error}</p>
          </div>
        </div>
      )}

      {successInfo && (
        <div className={`flex items-center justify-between gap-3 p-4 border rounded-2xl ${t.cardBg}`} id="uploader-success-state">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-450 text-emerald-400 shrink-0" />
            <div className="text-left">
              <p className="text-xs font-semibold text-emerald-450 text-emerald-400">Muvaffaqiyatli yuklandi / Parsed Successfully</p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                {successInfo.name} • <strong className="text-emerald-400">{successInfo.count}</strong> questions generated.
              </p>
            </div>
          </div>
          <span className="bg-emerald-500/10 text-emerald-450 text-emerald-400 text-[10px] font-mono select-none px-2.5 py-1 rounded-lg font-bold border border-emerald-500/25">
            READY
          </span>
        </div>
      )}
    </div>
  );
}
