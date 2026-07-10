import React from "react";
import { 
  Zap, 
  ShieldCheck, 
  Leaf, 
  Award, 
  FileText, 
  Building, 
  Clock, 
  Activity, 
  FileCheck,
  User,
  MapPin,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import { GeneratorModel, ElectricityBill, FinanceAnalysis } from "../types";

// High-fidelity vector vortex logo representing Octa Energy precisely
export const OctaLogoSvg: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e40af" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
      <linearGradient id="cyanGrad" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0891b2" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    
    {/* Beautiful swirling energy vortex matching the user-uploaded image */}
    {/* Swirl Blade 1 (Blue) */}
    <path d="M50 12 C64 12 78 24 82 40 C86 56 74 76 58 84 C46 90 30 84 22 72 C16 60 20 44 32 34 C40 26 50 12 50 12 Z" fill="url(#blueGrad)" opacity="0.9" />
    {/* Swirl Blade 2 (Green) */}
    <path d="M50 88 C36 88 22 76 18 60 C14 44 26 24 42 16 C54 10 70 16 78 28 C84 40 80 56 68 66 C60 74 50 88 50 88 Z" fill="url(#greenGrad)" opacity="0.95" />
    {/* Swirl Blade 3 (Cyan/Accent) */}
    <path d="M35 35 C45 22 65 20 75 30 C81 36 81 48 73 58 C65 68 49 70 39 60 C33 54 31 44 35 35 Z" fill="url(#cyanGrad)" opacity="0.8" />
    {/* White Central Core */}
    <circle cx="50" cy="50" r="15" fill="white" />
    <circle cx="50" cy="50" r="10" fill="url(#blueGrad)" />
    
    {/* Elegant orbit rings */}
    <circle cx="50" cy="50" r="44" stroke="#60a5fa" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.3" />
    <circle cx="50" cy="50" r="48" stroke="#34d399" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.4" />
  </svg>
);

// Modular decorative corners for World-Class frames (Molduras)
const PageCornerDecoration: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  const colorClass = isDark ? "border-emerald-500/30" : "border-blue-900/25";
  return (
    <>
      <div className={`absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 ${colorClass} rounded-tl-xs pointer-events-none z-20`}></div>
      <div className={`absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 ${colorClass} rounded-tr-xs pointer-events-none z-20`}></div>
      <div className={`absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 ${colorClass} rounded-bl-xs pointer-events-none z-20`}></div>
      <div className={`absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 ${colorClass} rounded-br-xs pointer-events-none z-20`}></div>
    </>
  );
};

interface CorporateProposalLayoutProps {
  generatedProposal: string;
  legalAuditReport?: string;
  selectedGenerator: GeneratorModel;
  electricityBill: ElectricityBill;
  financeAnalysis: FinanceAnalysis | null;
  selectedOption: "venda" | "locacao";
  vendaSplit50: boolean;
  bndesDownPayment: number;
  locacaoInstallmentPercent: number;
  isRevised: boolean;
  isSigned: boolean;
  signerCpf: string;
  signedAt: string;
  proposalFontSize: "sm" | "base" | "lg" | "xl";
  quantityVenda?: number;
  quantityLocacao?: number;
}

export const CorporateProposalLayout: React.FC<CorporateProposalLayoutProps> = ({
  generatedProposal,
  legalAuditReport,
  selectedGenerator,
  electricityBill,
  financeAnalysis,
  selectedOption,
  vendaSplit50,
  bndesDownPayment,
  locacaoInstallmentPercent,
  isSigned,
  signerCpf,
  signedAt,
  proposalFontSize,
  quantityVenda = 1,
  quantityLocacao = 1,
}) => {
  const quantity = selectedOption === "venda" ? quantityVenda : quantityLocacao;
  
  // Custom renderer for bold formatting
  const renderBoldText = (text: string) => {
    if (!text) return "";
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-semibold text-slate-900 bg-blue-50 px-1 rounded border border-blue-100/50">{part}</strong>;
      }
      return part;
    });
  };

  // Custom JSX renderer to parse markdown nicely inside the template
  const renderFormattedMarkdown = (text: string, sizeClass: typeof proposalFontSize) => {
    if (!text) return null;
    const rawLines = text.split("\n");
    
    // Filter out Cover/Capa and meta headers
    const lines = rawLines.filter(line => {
      const trimmed = line.trim();
      const lower = trimmed.toLowerCase();
      if (lower.includes("capa:") || lower.includes("1. capa") || lower.includes("capa octa") || lower.includes("código de referência") || lower.includes("destinatário:") || lower.includes("proponente:") || lower.includes("data de emissão")) {
        return false;
      }
      if (trimmed.startsWith("## ") && (lower.includes("capa") || lower.includes("proposta"))) {
        return false;
      }
      if (trimmed.startsWith("# ") && (lower.includes("capa") || lower.includes("proposta"))) {
        return false;
      }
      return true;
    });
    
    const sizeMap = {
      sm: "text-xs md:text-sm leading-relaxed",
      base: "text-sm md:text-base leading-relaxed",
      lg: "text-base md:text-lg leading-relaxed font-normal",
      xl: "text-lg md:text-xl leading-relaxed font-normal"
    };

    return (
      <div className={`space-y-4 font-sans text-slate-700 ${sizeMap[sizeClass]}`}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-3" />;

          // Headers
          if (trimmed.startsWith("###")) {
            const content = trimmed.replace(/^###\s*/, "");
            if (content.toLowerCase().includes("proposta técnico-comercial") || content.toLowerCase().includes("proposta comercial")) {
              return null;
            }
            return (
              <h3 key={idx} className="text-base md:text-lg font-bold font-display text-blue-900 border-b border-slate-200 pb-1.5 mt-6 mb-3 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-4 bg-blue-800 rounded-sm inline-block shrink-0"></span>
                {content}
              </h3>
            );
          }

          if (trimmed.startsWith("####")) {
            const content = trimmed.replace(/^####\s*/, "");
            return (
              <h4 key={idx} className="text-sm md:text-base font-bold text-slate-900 mt-4 mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-blue-600 rounded-xs inline-block shrink-0"></span>
                {content}
              </h4>
            );
          }

          if (trimmed === "---") {
            return <hr key={idx} className="border-t border-slate-200 my-4" />;
          }

          // Bullet points
          if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
            const content = trimmed.replace(/^[\*\-]\s*/, "");
            return (
              <div key={idx} className="flex items-start gap-2.5 ml-4 my-1.5 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></span>
                <span className="flex-1 text-slate-600 text-xs md:text-sm">{renderBoldText(content)}</span>
              </div>
            );
          }

          // Numbered lists
          if (/^\d+\.\s+/.test(trimmed)) {
            const content = trimmed.replace(/^\d+\.\s+/, "");
            const num = trimmed.match(/^\d+/)?.[0] || "1";
            return (
              <div key={idx} className="flex items-start gap-2.5 ml-4 my-1.5 leading-relaxed">
                <span className="font-mono text-blue-800 font-bold shrink-0 min-w-[1.2rem] text-xs md:text-sm">{num}.</span>
                <span className="flex-1 text-slate-600 text-xs md:text-sm">{renderBoldText(content)}</span>
              </div>
            );
          }

          // Standard paragraph
          return (
            <p key={idx} className="leading-relaxed text-justify my-1.5 text-slate-600 text-xs md:text-sm">
              {renderBoldText(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  const currentDateStr = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="w-full text-slate-850 font-sans print:bg-white print:text-black">
      
      {/* ==================== PAGINA 1: CAPA PROFISSIONAL (COVER) ==================== */}
      <div className="relative min-h-[290mm] flex flex-col justify-between p-12 md:p-16 bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden mb-12 border border-slate-200 break-after-page page-break print:min-h-screen print:h-screen print:rounded-none print:shadow-none print:border-none print:mb-0 print:p-12">
        {/* World-Class Outer Moldura / Frame */}
        <div className="absolute inset-5 border border-emerald-500/30 rounded-xl pointer-events-none z-20"></div>
        <div className="absolute inset-6 border border-slate-200 rounded-lg pointer-events-none z-20"></div>
        <PageCornerDecoration isDark={false} />

        {/* Subtle geometric overlay accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        {/* Logo and Headings inside a premium container */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 shadow-md shrink-0">
              <OctaLogoSvg className="w-20 h-20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black font-display tracking-wider text-slate-900">OCTA ENERGY</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 tracking-widest uppercase shrink-0">
                  CINÉTICO ECOLÓGICO
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 mt-1 uppercase tracking-widest">Tecnologia de Transição Energética Avançada</p>
            </div>
          </div>
          <div className="text-right font-mono text-[9px] text-slate-600 border border-slate-200 bg-slate-50 p-3 rounded-lg min-w-[180px]">
            <div>REF: PROP-OCTA-{selectedGenerator.capacityKva}KVA</div>
            <div>STATUS: PROPOSTA EXECUTIVA</div>
          </div>
        </div>

        {/* Central visual block with generator model */}
        <div className="relative z-10 my-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-6">
          {/* Left Column: Title and Subtitles */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Estudo de Viabilidade Técnico-Comercial
            </span>
            <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 leading-tight">
              PROPOSTA DE <span className="text-emerald-600 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">INDEPENDÊNCIA</span> ENERGÉTICA
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Implantação assistida de Gerador Cinético Magnético Magnestor de alta performance com pegada de carbono zero e 100% de estabilidade de base.
            </p>
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center shrink-0 min-w-[100px]">
                <span className="block text-[10px] text-slate-500 uppercase font-mono">Capacidade</span>
                <span className="text-lg font-bold text-emerald-600">{selectedGenerator.capacityKva} KVA</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center shrink-0 min-w-[100px]">
                <span className="block text-[10px] text-slate-500 uppercase font-mono">Potência</span>
                <span className="text-lg font-bold text-emerald-600">{selectedGenerator.powerKw} kW</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-center shrink-0 min-w-[100px]">
                <span className="block text-[10px] text-emerald-700 uppercase font-mono font-bold">Quantidade</span>
                <span className="text-lg font-extrabold text-emerald-700">{quantity} {quantity === 1 ? "unid." : "unid."}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center shrink-0 min-w-[100px]">
                <span className="block text-[10px] text-slate-500 uppercase font-mono">Retorno (médio)</span>
                <span className="text-lg font-bold text-emerald-600">
                  {selectedOption === "venda" ? `${financeAnalysis?.paybackSimple || 36} meses` : "Imediato"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Generator Cover Image */}
          <div className="w-full lg:w-96 shrink-0 flex flex-col items-center">
            <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 p-2 shadow-2xl transition-all hover:border-emerald-500/50">
              <img 
                src={selectedGenerator.imageUrl || "/src/assets/images/octa_medium_generator_1782531660782.jpg"} 
                alt={selectedGenerator.name} 
                className="w-full h-56 md:h-64 object-cover rounded-xl grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
              
              {/* Overlay Badge */}
              <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                <div>
                  <span className="block text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Equipamento Selecionado</span>
                  <span className="text-sm font-bold text-white font-display">
                    {quantity > 1 ? `${quantity}x ` : ""}{selectedGenerator.name}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-white bg-emerald-600/90 border border-emerald-500/30 px-2.5 py-1 rounded-md shadow-sm uppercase font-mono">
                  Base Load 24/7
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-3 italic text-center">
              *Ilustração técnica do Gerador de Energia Cinética OCTA. Patente Registrada.
            </p>
          </div>
        </div>

        {/* Addressing and executive footer */}
        <div className="relative z-10 border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-end gap-6">
          {/* Executive Addressing Box */}
          <div className="w-full md:w-auto bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3 min-w-[320px]">
            <h4 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Detalhes de Endereçamento & Destinatário
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-slate-500 w-16 shrink-0 font-mono">Para:</span>
                <span className="text-slate-900 font-semibold truncate">{electricityBill.clientName || "Cliente Corporativo S/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-slate-500 w-16 shrink-0 font-mono">A/C:</span>
                <span className="text-slate-700">{electricityBill.clientName || "Diretoria e Gestão Operacional"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-slate-500 w-16 shrink-0 font-mono">De:</span>
                <span className="text-emerald-600 font-bold">OCTA ENERGY LTDA</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-slate-500 w-16 shrink-0 font-mono">Data:</span>
                <span className="text-slate-700">{currentDateStr}</span>
              </div>
            </div>
          </div>

          {/* Compliance and Certification Seals */}
          <div className="flex items-center gap-4 text-right">
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-mono tracking-widest font-semibold">Compliance Corporativo</div>
              <div className="flex flex-wrap gap-2 justify-end">
                <span className="text-[8px] border border-slate-200 bg-slate-50 px-2 py-1 rounded text-slate-700 font-bold font-mono">ISO 14001</span>
                <span className="text-[8px] border border-slate-200 bg-slate-50 px-2 py-1 rounded text-slate-700 font-bold font-mono">ISO 9001</span>
                <span className="text-[8px] border border-slate-200 bg-slate-50 px-2 py-1 rounded text-slate-700 font-bold font-mono">ESG CERTIFIED</span>
              </div>
              <div className="text-[8px] text-slate-400 mt-1">Este documento contém informações estritamente confidenciais e comerciais.</div>
            </div>
          </div>
        </div>
      </div>


      {/* ==================== PAGINA 2: APRESENTAÇÃO TECNOLOGIA & VANTAGENS ==================== */}
      <div className="relative min-h-[290mm] flex flex-col justify-between p-12 md:p-16 bg-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-slate-200 break-after-page page-break print:min-h-screen print:h-screen print:rounded-none print:shadow-none print:border-none print:mb-0 print:p-12">
        {/* World-Class Outer Moldura / Frame */}
        <div className="absolute inset-5 border-2 border-blue-900/10 rounded-xl pointer-events-none z-20"></div>
        <div className="absolute inset-6 border border-blue-900/5 rounded-lg pointer-events-none z-20"></div>
        <PageCornerDecoration isDark={false} />

        <div className="relative z-10">
          {/* Header persistent template - Premium Blue Box Header with White Text and Logo */}
          <div className="bg-gradient-to-r from-sky-100 via-blue-50 to-sky-100 border border-blue-200 rounded-xl p-4 flex items-center justify-between shadow-md text-slate-900 mb-8 relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="bg-white p-1.5 rounded-lg shadow-inner border border-blue-200 shrink-0">
                <OctaLogoSvg className="w-16 h-16" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black font-display tracking-wider text-slate-900">OCTA ENERGY</span>
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 tracking-wider uppercase shrink-0">
                    ECOLÓGICO
                  </span>
                </div>
                <p className="text-[9px] font-mono text-blue-800 tracking-wider uppercase mt-0.5">Soluções de Autonomia Energética</p>
              </div>
            </div>
            
            <div className="text-right font-mono text-[9px] text-slate-600 leading-tight border-l border-slate-200 pl-4 hidden sm:block relative z-10">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[9px]">Estudo Técnico-Comercial</div>
              <div className="mt-0.5">REF: PROP-OCTA-{selectedGenerator.capacityKva}KVA</div>
              <div className="mt-0.5 text-blue-700 font-semibold">Vigência: 30 dias</div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider font-mono">Seção 01</span>
              <h2 className="text-2xl font-bold text-slate-900 font-display mt-1 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-800 shrink-0" /> 1. Introdução à Tecnologia Cinética Magnética
              </h2>
              <div className="h-1 w-20 bg-blue-800 mt-2.5 rounded-sm"></div>
            </div>

            <div className="text-sm text-slate-600 leading-relaxed space-y-4">
              <p>
                A tecnologia desenvolvida pela <strong>OCTA ENERGY</strong> representa o ápice da engenharia eletromecânica aplicada à sustentabilidade e transição energética. Diferente dos geradores solares ou eólicos que sofrem com as flutuações e intermitências climáticas, ou dos motogeradores a combustão que demandam a queima constante de óleo diesel ou gás e emitem ruídos nocivos e dióxido de carbono, o <strong>Gerador Cinético Magnético OCTA</strong> opera em regime de <strong>Base Load absoluto (24 horas por dia, 7 dias por semana)</strong>.
              </p>
              <p>
                O princípio operacional baseia-se na sustentação e amplificação de torque por acoplamento magnético e indução eletromagnética de alta eficiência. Utilizando superímãs de neodímio sob arranjo geométrico otimizado e mananciais de levitação magnética com atrito quase nulo, o gerador garante um rendimento constante de <strong>97% (com apenas 3% de perdas gerais de calor e fricção)</strong>.
              </p>
              <p>
                A infraestrutura de conexão do gerador cinético é simplificada e totalmente compatível com a rede de distribuição local e as subestações industriais do cliente, entregando energia limpa com regulação ativa de frequência e mitigação automática de distorções harmônicas.
              </p>
            </div>

            {/* Competitive Advantages Section (Multinational-Level Grid) */}
            <div className="pt-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 font-mono">
                Vantagens Competitivas e Diferenciais da Solução:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-3.5 hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Autonomia e Base Load 24/7</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Operação ininterrupta em qualquer condição meteorológica. Sem riscos de falta de vento ou noite, garantindo estabilidade total da voltagem para maquinários sensíveis.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-3.5 hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Custo Zero de Combustível</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Independência total de flutuações de preços internacionais de petróleo ou gás natural. O combustível é o próprio movimento cinético assistido por acoplamento de torque magnético.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-3.5 hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Pegada Ecológica Zero (ESG)</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Perfeitamente alinhado com as metas corporativas ESG. Sem queima de hidrocarbonetos, sem emissão de monóxido de carbono e totalmente reciclável ao final da vida útil.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-3.5 hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Durabilidade Industrial Máxima</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Estrutura mecânica projetada para 20 anos de operação produtiva. Mancais de levitação reduzem o desgaste de fricção a patamares praticamente insignificantes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer persistent template */}
        <div className="border-t border-slate-200 pt-4 mt-8 flex justify-between items-center text-[9px] font-mono text-slate-400 tracking-wider relative z-10">
          <span>OCTA ENERGY S/A • Fortaleza, Ceará, Brasil</span>
          <span>Página 2 de 3</span>
        </div>
      </div>


      {/* ==================== PAGINA 3: DETALHES COMERCIAIS E CORPO DA PROPOSTA ==================== */}
      <div className="relative min-h-[290mm] flex flex-col justify-between p-12 md:p-16 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 print:min-h-screen print:h-auto print:rounded-none print:shadow-none print:border-none print:p-12">
        {/* World-Class Outer Moldura / Frame */}
        <div className="absolute inset-5 border-2 border-blue-900/10 rounded-xl pointer-events-none z-20"></div>
        <div className="absolute inset-6 border border-blue-900/5 rounded-lg pointer-events-none z-20"></div>
        <PageCornerDecoration isDark={false} />

        <div className="relative z-10">
          {/* Header persistent template - Premium Blue Box Header with White Text and Logo */}
          <div className="bg-gradient-to-r from-sky-100 via-blue-50 to-sky-100 border border-blue-200 rounded-xl p-4 flex items-center justify-between shadow-md text-slate-900 mb-8 relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="bg-white p-1.5 rounded-lg shadow-inner border border-blue-200 shrink-0">
                <OctaLogoSvg className="w-16 h-16" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black font-display tracking-wider text-slate-900">OCTA ENERGY</span>
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 tracking-wider uppercase shrink-0">
                    ECOLÓGICO
                  </span>
                </div>
                <p className="text-[9px] font-mono text-blue-800 tracking-wider uppercase mt-0.5">Soluções de Autonomia Energética</p>
              </div>
            </div>
            
            <div className="text-right font-mono text-[9px] text-slate-600 leading-tight border-l border-slate-200 pl-4 hidden sm:block relative z-10">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[9px]">Memorial Técnico & Condições</div>
              <div className="mt-0.5">REF: PROP-OCTA-{selectedGenerator.capacityKva}KVA</div>
              <div className="mt-0.5 text-blue-700 font-semibold">Vigência: 30 dias</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider font-mono">Seção 02</span>
              <h2 className="text-2xl font-bold text-slate-900 font-display mt-1 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-800 shrink-0" /> 2. Proposta Financeira & Detalhes do Negócio
              </h2>
              <div className="h-1 w-20 bg-blue-800 mt-2.5 rounded-sm"></div>
            </div>

            {/* MAIN GENERATED PROPOSAL CONTENT */}
            <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100">
              {renderFormattedMarkdown(generatedProposal, proposalFontSize)}
            </div>

            {/* Render legal audit section inside sheet if available */}
            {legalAuditReport && (
              <div className="border-t border-slate-200 pt-6 mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] bg-purple-100 text-purple-800 border border-purple-200 px-3 py-0.5 rounded-full font-bold uppercase tracking-wide">
                    Parecer Técnico-Jurídico de Compliance & Engenharia
                  </span>
                  <span className="text-[10px] text-blue-800 font-mono">Original</span>
                </div>
                <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-150">
                  {renderFormattedMarkdown(legalAuditReport, proposalFontSize)}
                </div>
              </div>
            )}

            {/* Acceptance and Fabrication Clause */}
            {(selectedOption === "locacao" || (selectedOption === "venda" && vendaSplit50)) && (
              <div className="border-t border-slate-200 pt-5 mt-6 bg-slate-50/70 p-4 rounded-xl border">
                <h5 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-800" /> Cláusula de Aceite Formal & Regra de Fabricação
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Ao assinar digitalmente este termo de aceite, o contratante declara ciência e concordância de que o custo estrutural de fabricação e montagem do equipamento é lastreado pelo fluxo de caixa inicial acordado conforme a <strong>Regra de Fabricação (Aporte de Mobilização de Ativos)</strong>:
                </p>
                <ol className="text-xs text-slate-700 space-y-1 list-decimal list-inside font-mono bg-white p-3 rounded-lg border border-slate-200">
                  {selectedOption === "venda" ? (
                    <>
                      <li>
                        <strong>Aporte de Entrada (50%):</strong> R$ {bndesDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pago no ato do pedido de compra.
                      </li>
                      <li>
                        <strong>Saldo na Entrega e Posto em Marcha (50%):</strong> R$ {bndesDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pago mediante a entrega física e inicialização do gerador.
                      </li>
                    </>
                  ) : (
                    <li>
                      <strong>Sinal de Fabricação ({locacaoInstallmentPercent}%):</strong> R$ {((financeAnalysis?.investment || 0) * (locacaoInstallmentPercent / 100)).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pago no ato da assinatura do contrato e emissão da ordem de produção.
                    </li>
                  )}
                </ol>
              </div>
            )}

            {/* Signatures block */}
            <div className="border-t border-slate-200 pt-6 mt-8 grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 flex items-center justify-center mb-1">
                  <span className="font-cursive text-blue-900 text-lg select-none rotate-[-2deg] font-semibold">Cássio Vale</span>
                </div>
                <div className="w-40 border-b border-slate-300"></div>
                <span className="text-[9px] font-bold text-slate-800 mt-1.5">Cássio Vale</span>
                <span className="text-[8px] text-slate-400 font-mono">Diretor de Engenharia • OCTA ENERGY</span>
                <div className="text-[7px] text-blue-800 font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded mt-1.5 uppercase tracking-wider">Assinado Eletronicamente</div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="h-10 flex items-center justify-center mb-1">
                  {isSigned ? (
                    <span className="font-cursive text-blue-900 text-lg select-none rotate-[2deg] font-semibold">{electricityBill.clientName || "Representante Autorizado"}</span>
                  ) : (
                    <span className="text-slate-400 text-xs italic select-none">Aguardando assinatura digital</span>
                  )}
                </div>
                <div className={`w-40 border-b ${isSigned ? 'border-blue-600' : 'border-slate-300 border-dashed'}`}></div>
                <span className="text-[9px] font-bold text-slate-800 mt-1.5">{electricityBill.clientName || "Representante Autorizado"}</span>
                <span className="text-[8px] text-slate-400 font-mono">Cliente Contratante</span>
                {isSigned ? (
                  <div className="flex flex-col items-center mt-1">
                    <div className="text-[7px] text-blue-800 font-bold bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded uppercase tracking-wider">Assinado via ICP-Brasil</div>
                    <span className="text-[6px] text-slate-400 font-mono mt-0.5">{signerCpf || "Sob Demanda"} • {signedAt}</span>
                  </div>
                ) : (
                  <div className="text-[7px] text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded mt-1.5 uppercase tracking-wider">Pendente ICP-Brasil</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Persistent footer on last page */}
        <div className="border-t border-slate-200 pt-4 mt-12 flex justify-between items-center text-[9px] font-mono text-slate-400 tracking-wider relative z-10">
          <span>OCTA ENERGY S/A • www.octaenergy.com.br • SAC: 0800-OCTA-900</span>
          <span>Página 3 de 3</span>
        </div>
      </div>

    </div>
  );
};
