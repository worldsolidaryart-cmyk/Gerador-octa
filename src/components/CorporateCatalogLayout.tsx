import React from "react";
import { 
  Zap, 
  ShieldCheck, 
  Leaf, 
  Award, 
  Layers, 
  Sparkles,
  Info,
  CheckCircle2,
  Settings,
  FlameKindling,
  Cpu
} from "lucide-react";
import { GeneratorModel } from "../types";
import { GENERATORS_CATALOG } from "../data";
import { OctaLogoSvg } from "./CorporateProposalLayout";

interface CorporateCatalogLayoutProps {
  catalogFontSize?: "sm" | "base" | "lg";
}

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

export const CorporateCatalogLayout: React.FC<CorporateCatalogLayoutProps> = ({
  catalogFontSize = "base"
}) => {
  const fontSizeClass = catalogFontSize === "sm" ? "text-xs" : catalogFontSize === "lg" ? "text-base" : "text-sm";

  return (
    <div className="w-full bg-slate-100 flex flex-col gap-8 print:gap-0 print:bg-white select-text">
      {/* PAGE 1: CATALOG COVER (CAPA DO CATÁLOGO) */}
      <div className="relative w-full max-w-[210mm] min-h-[297mm] h-[297mm] bg-white border border-slate-200 shadow-lg p-16 flex flex-col justify-between overflow-hidden shrink-0 print:border-none print:shadow-none print:m-0 page-break-after-always">
        <PageCornerDecoration />
        
        {/* Subtle Elegant Header Rule */}
        <div className="flex justify-between items-center border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-2">
            <OctaLogoSvg className="w-8 h-8" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-slate-900 uppercase">OCTA ENERGY</span>
          </div>
          <span className="font-mono text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">
            TECNOLOGIA LIMPA 100% AUTÔNOMA
          </span>
        </div>

        {/* Cover Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
          <div className="mb-8">
            <OctaLogoSvg className="w-28 h-28 animate-spin-slow shadow-sm rounded-full p-1 bg-slate-50" />
          </div>

          <span className="text-[11px] font-mono tracking-widest font-extrabold text-emerald-600 uppercase bg-emerald-50/50 border border-emerald-100 px-3.5 py-1.5 rounded-lg mb-4">
            CATÁLOGO CORPORATIVO DE PRODUTOS
          </span>

          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900 tracking-tight leading-none mb-3">
            Geradores Cinéticos de Energia Autônoma de Base
          </h1>
          
          <p className="text-sm text-slate-500 max-w-lg mb-8 font-mono tracking-wide">
            Série OCTA — Geração Contínua Base Load de Alta Performance Sem Combustão, Livre de Emissões e sem Uso de Combustível.
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-cyan-500 rounded-full mb-8"></div>

          <div className="grid grid-cols-3 gap-6 w-full max-w-md bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
            <div>
              <span className="block text-[18px] font-mono font-bold text-slate-900">0%</span>
              <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block font-bold">Emissão CO₂</span>
            </div>
            <div className="border-x border-slate-200">
              <span className="block text-[18px] font-mono font-bold text-emerald-600">97%</span>
              <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block font-bold">Rendimento</span>
            </div>
            <div>
              <span className="block text-[18px] font-mono font-bold text-blue-600">24/7</span>
              <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block font-bold">Operação Útil</span>
            </div>
          </div>
        </div>

        {/* Cover Footer */}
        <div className="border-t border-slate-200/80 pt-6 flex justify-between items-end text-[10px] text-slate-400 font-mono">
          <div>
            <p className="font-bold text-slate-700">OCTA ENERGY ENTERPRISE S.A.</p>
            <p>Divisão de Engenharia Eletromecânica</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-700">Versão Oficial 2026</p>
            <p>Documentação de Referência de Mercado</p>
          </div>
        </div>
      </div>

      {/* PAGE 2: TECHNOLOGY OVERVIEW (VISÃO TECNOLÓGICA) */}
      <div className="relative w-full max-w-[210mm] min-h-[297mm] h-[297mm] bg-white border border-slate-200 shadow-lg p-16 flex flex-col justify-between overflow-hidden shrink-0 print:border-none print:shadow-none print:m-0 page-break-after-always">
        <PageCornerDecoration />

        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-1.5">
            <OctaLogoSvg className="w-6 h-6" />
            <span className="font-mono text-[9px] font-bold tracking-widest text-slate-900 uppercase">OCTA ENERGY</span>
          </div>
          <span className="font-mono text-[8px] text-slate-400">Catálogo de Produtos | Tecnologia</span>
        </div>

        {/* Content */}
        <div className="flex-1 py-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold font-display text-blue-950 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" />
              <span>O Princípio de Funcionamento OCTA (Sistema GAEL)</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mt-2 text-justify">
              Diferente de geradores fotovoltaicos (que dependem de radiação solar) ou geradores a combustão convencional (que requerem suprimento contínuo de diesel ou gás), a <strong>Tecnologia de Indução Cinética Autônoma de Base Magnética (GAEL)</strong> utiliza a propensão eletromecânica assistida por superímãs de neodímio de alta densidade e um rotor mecânico de inércia contínua balanceada. 
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mt-1 text-justify">
              Uma vez acionado via ciclo de inicialização inicial (setup), o rotor magnético sustenta o giro dinâmico de indução no estator sob altíssima linearidade mecânica, resultando em um rendimento projetado de <strong>97%</strong>. As perdas por atrito e dissipação térmica são mínimas (apenas 3%), garantindo independência total de redes elétricas instáveis das concessionárias de distribuição.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-800 font-mono uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Isolação Acústica e Térmica
              </span>
              <p className="text-[11px] text-slate-500 leading-normal text-justify">
                Nossas cabines silenciadas possuem carenagem especial blindada com pintura epóxi antiferrugem e isolamento interno à base de mantas acústicas densas de poliuretano expandido. Isso reduz os níveis de ruído para <strong>menos de 50 dB</strong> a 1,5 metros, possibilitando a instalação em áreas residenciais, clínicas hospitalares e escritórios sem distúrbios sonoros.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-800 font-mono uppercase tracking-wide flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" /> Sustentabilidade Total
              </span>
              <p className="text-[11px] text-slate-500 leading-normal text-justify">
                Ao eliminar o consumo de combustíveis fósseis, um gerador cinético de base reduz instantaneamente a pegada de carbono de operações de alta demanda. Não há fumaça, chaminés de exaustão ou descarte de óleos lubrificantes em excesso, tornando o equipamento a única fonte de geração de energia estável de base com <strong>emissão zero de CO₂</strong> certificada.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl">
            <h3 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" /> Vantagens e Diferenciais Estruturais
            </h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-slate-600 font-mono">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                <span>Base Load real 24 horas por dia (24/7)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                <span>Operação silenciosa menor que 50 dB</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                <span>Disponibilidade física nominal de 100%</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                <span>Vida útil útil estimada do rotor de 30 anos</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                <span>Integração IoT e CLP industrial inteligente</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                <span>Instalação simplificada de 2 a 30 m²</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-[10px] text-emerald-850 leading-normal">
              <strong>Sincronismo Digital Habilitado:</strong> Todos os modelos contam com painel de paralelismo integrado com sincronismo eletrônico instantâneo. Isso permite conectar até 10 unidades em paralelo no mesmo barramento, ajustando-se a futuras expansões da planta fabril ou predial do cliente.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200/80 pt-4 flex justify-between items-center text-[9px] text-slate-400 font-mono">
          <span>OCTA ENERGY Enterprise — Catálogo 2026</span>
          <span>Página 2 de 4</span>
        </div>
      </div>

      {/* PAGE 3: COMERCIAL & PRICES TABLE (TABELA DE PREÇOS OFICIAL) */}
      <div className="relative w-full max-w-[210mm] min-h-[297mm] h-[297mm] bg-white border border-slate-200 shadow-lg p-16 flex flex-col justify-between overflow-hidden shrink-0 print:border-none print:shadow-none print:m-0 page-break-after-always">
        <PageCornerDecoration />

        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-1.5">
            <OctaLogoSvg className="w-6 h-6" />
            <span className="font-mono text-[9px] font-bold tracking-widest text-slate-900 uppercase">OCTA ENERGY</span>
          </div>
          <span className="font-mono text-[8px] text-slate-400">Tabela Geral de Preços | Portfólio Comercial</span>
        </div>

        {/* Content */}
        <div className="flex-1 py-6 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-bold font-display text-blue-950 border-b border-slate-100 pb-1.5 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" />
              <span>Tabela Oficial de Vendas e Locações de Geradores</span>
            </h2>
            <p className="text-[11px] text-slate-500 leading-normal mt-1">
              Consulte a seguir todos os modelos homologados da linha OCTA. Os valores são válidos para faturamento direto de fábrica com isenção fiscal sob incentivo de transição para energia limpa e financiamento via BNDES Finame.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left border-collapse text-[10px] font-mono">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-bold uppercase text-[8px] tracking-wider">
                  <th className="p-2.5 font-bold">Modelo</th>
                  <th className="p-2.5 text-center font-bold">Capac.</th>
                  <th className="p-2.5 text-center font-bold">Potência</th>
                  <th className="p-2.5 text-center font-bold">Área Ocupada</th>
                  <th className="p-2.5 text-right font-bold">Preço Venda</th>
                  <th className="p-2.5 text-right font-bold">Locação Ref.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {GENERATORS_CATALOG.map((gen) => (
                  <tr key={gen.capacityKva} className="hover:bg-slate-50/50">
                    <td className="p-2 font-bold text-slate-900">{gen.name}</td>
                    <td className="p-2 text-center font-bold text-slate-600">{gen.capacityKva} kVA</td>
                    <td className="p-2 text-center text-slate-600">{gen.powerKw} kW</td>
                    <td className="p-2 text-center text-slate-500">{gen.area}</td>
                    <td className="p-2 text-right font-bold text-slate-900">
                      R$ {gen.vendaPrice.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                    </td>
                    <td className="p-2 text-right font-semibold text-indigo-600">
                      R$ {gen.locacaoRefPrice.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}/m
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-[10.5px] text-slate-600 leading-normal">
            <h4 className="font-bold text-slate-800 uppercase text-[9px] tracking-wider mb-1 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              INFORMAÇÕES DE FATURAMENTO & FRETE
            </h4>
            <p>
              * <strong>Regra de Fabricação Venda 50/50:</strong> Todos os pedidos de compra direta requerem 50% de sinal de entrada para início da montagem estrutural e 50% na entrega e posto em marcha.
            </p>
            <p className="mt-1">
              * <strong>Locações Estruturadas:</strong> Estão inclusas manutenções corretivas e preventivas periódicas sem custo adicional durante toda a vigência do contrato comercial de 60 meses.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200/80 pt-4 flex justify-between items-center text-[9px] text-slate-400 font-mono">
          <span>OCTA ENERGY Enterprise — Catálogo 2026</span>
          <span>Página 3 de 4</span>
        </div>
      </div>

      {/* PAGE 4: TECHNICAL DETAILS & HIGHLIGHTS (ESPECIFICAÇÕES DETALHADAS) */}
      <div className="relative w-full max-w-[210mm] min-h-[297mm] h-[297mm] bg-white border border-slate-200 shadow-lg p-16 flex flex-col justify-between overflow-hidden shrink-0 print:border-none print:shadow-none print:m-0">
        <PageCornerDecoration />

        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-1.5">
            <OctaLogoSvg className="w-6 h-6" />
            <span className="font-mono text-[9px] font-bold tracking-widest text-slate-900 uppercase">OCTA ENERGY</span>
          </div>
          <span className="font-mono text-[8px] text-slate-400">Especificações e Selo de Garantia</span>
        </div>

        {/* Content */}
        <div className="flex-1 py-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold font-display text-blue-950 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-500" />
              <span>Diferenciais Construtivos de Elite</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mt-2 text-justify">
              Todos os geradores magnéticos cinéticos da linha OCTA são manufaturados sob os mais rígidos processos de tolerância micrométrica industrial, garantindo durabilidade máxima mesmo sob regime de sobrecarga mecânica transitória.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Microprocessador ARM e Painel CLP Integrado</h4>
                <p className="text-[11px] text-slate-500 leading-normal text-justify">
                  Todos os módulos possuem uma central microprocessada avançada com telemetria via internet das coisas (IoT). Dados como velocidade angular do rotor (RPM), fator de potência (cos φ), temperatura dos mancais magnéticos de sustentação e frequência em tempo real são transmitidos criptografados via satélite ou rede celular ao centro de controle operacional (CCO) OCTA.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <FlameKindling className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Mancais Magnéticos Ativos (Levitação Ativa)</h4>
                <p className="text-[11px] text-slate-500 leading-normal text-justify">
                  A fricção mecânica do rotor principal é reduzida a praticamente zero através do uso de suspensão eletromagnética ativa de alta precisão. Isso elimina a necessidade de óleos lubrificantes de motor tradicionais e trocas constantes de filtros, reduzindo em 90% a necessidade de intervenções físicas para manutenção corretiva do equipamento.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Selo de Qualidade e Conformidade Ambiental</h4>
                <p className="text-[11px] text-slate-500 leading-normal text-justify">
                  Garantia integral de fábrica de <strong>10 anos</strong> para o rotor magnético de neodímio e de 5 anos para as cabines de isolamento térmico e acústico. Equipamento certificado e enquadrado nas diretivas ISO 9001 de gerenciamento de manufatura e ISO 14001 de conformidade e mitigação de impactos ecológicos.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 border border-dashed border-slate-300 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 bg-slate-50/50">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-widest font-mono">EQUIPAMENTO HOMOLOGADO</h5>
            <p className="text-[10px] text-slate-400 max-w-sm font-mono leading-normal">
              A linha de geradores cinéticos de base OCTA possui autorização de comercialização em conformidade com as normas ABNT e diretrizes regulatórias da ANP.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200/80 pt-4 flex justify-between items-center text-[9px] text-slate-400 font-mono">
          <span>OCTA ENERGY Enterprise — Catálogo 2026</span>
          <span>Página 4 de 4</span>
        </div>
      </div>
    </div>
  );
};
