import React, { useState, useEffect } from "react";
import { 
  Cpu, 
  DollarSign, 
  FileText, 
  FileCheck, 
  Users, 
  Activity, 
  TrendingUp, 
  Upload, 
  FileSpreadsheet, 
  Clock, 
  ChevronRight, 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  Briefcase, 
  Send, 
  Download, 
  RefreshCw, 
  Database,
  User,
  ShieldCheck,
  FileCode,
  Building,
  HelpCircle,
  Plus,
  BookOpen,
  Printer,
  Tag,
  Percent,
  X,
  Trash2,
  Info
} from "lucide-react";
import { recommendGenerator, performFeasibilityAnalysis, GENERATORS_CATALOG } from "./data";
import { ElectricityBill, GeneratorModel, FinanceAnalysis, CRMLead, CRMContract, CustomerTicket } from "./types";
import { CorporateProposalLayout } from "./components/CorporateProposalLayout";
import { CorporateCatalogLayout } from "./components/CorporateCatalogLayout";
import { isSupabaseConfigured, requestPasswordReset, signInPortal, signUpPortal, type PortalSession } from "./lib/supabaseAuth";

export default function App() {
  // Current role/profile for testing and demo perspectives
  const [currentProfile, setCurrentProfile] = useState<"admin" | "investor" | "client" | "agent">("admin");
  const [activeTab, setActiveTab] = useState<string>("dimensionador");
  const [portalSession, setPortalSession] = useState<PortalSession | null>(null);
  const [adminProposals, setAdminProposals] = useState<any[]>([]);
  const [adminProposalSearch, setAdminProposalSearch] = useState("");
  const [adminClients, setAdminClients] = useState<any[]>([]);
  const [selectedClientProposal, setSelectedClientProposal] = useState<any | null>(null);
  const [portalRole, setPortalRole] = useState<string | null>(null);
  const [adminTickets, setAdminTickets] = useState<any[]>([]);
  const [adminTicketFilter, setAdminTicketFilter] = useState<string>("");
  const [adminTicketSearch, setAdminTicketSearch] = useState("");
  const [adminReplyDrafts, setAdminReplyDrafts] = useState<Record<string, string>>({});
  const [portalLoginOpen, setPortalLoginOpen] = useState(false);
  const [portalMode, setPortalMode] = useState<"login" | "register" | "forgot">("login");
  const [portalLogin, setPortalLogin] = useState("");
  const [portalPassword, setPortalPassword] = useState("");
  const [portalName, setPortalName] = useState("");
  const [portalBusy, setPortalBusy] = useState(false);
  const [pendingPortal, setPendingPortal] = useState<"investidor" | "cliente" | null>(null);
  const [proposalEmailOpen, setProposalEmailOpen] = useState(false);
  const [proposalEmail, setProposalEmail] = useState("");
  const [proposalAction, setProposalAction] = useState<"generate" | "print" | null>(null);
  const [clientProposals, setClientProposals] = useState<any[]>([]);

  // Electricity bill state
  const [electricityBill, setElectricityBill] = useState<ElectricityBill>({
    clientName: "Empresa Ltda",
    consumoKwh: 266667,
    tarifa: 0.75,
    valorConta: 200000,
    demanda: 550,
    icms: 18,
    pis: 1.65,
    cofins: 7.6,
    bandeira: "Verde",
    historico: [
      { mes: "Jan/26", consumo: 255000, valor: 191250 },
      { mes: "Fev/26", consumo: 278000, valor: 208500 },
      { mes: "Mar/26", consumo: 262000, valor: 196500 },
      { mes: "Abr/26", consumo: 245000, valor: 183750 },
      { mes: "Mai/26", consumo: 239000, valor: 179250 },
      { mes: "Jun/26", consumo: 266667, valor: 200000 }
    ]
  });

  // Numeric inputs for manual adjustments
  const [manualValor, setManualValor] = useState<string>("200000");
  const [manualConsumo, setManualConsumo] = useState<string>("266667");
  const [manualClientName, setManualClientName] = useState<string>("Empresa Ltda");
  const [manualCnpj, setManualCnpj] = useState<string>("00.000.000/0001-00");
  const [manualInscEstadual, setManualInscEstadual] = useState<string>("00.000.000-0");

  // Selected Generator & Model
  const [selectedGenerator, setSelectedGenerator] = useState<GeneratorModel>(GENERATORS_CATALOG[11]); // Default 500 KVA
  const [selectedOption, setSelectedOption] = useState<"venda" | "locacao">("locacao");
  const [catalogFilter, setCatalogFilter] = useState<"all" | "compact" | "medium" | "heavy">("all");
  const [catalogSearch, setCatalogSearch] = useState<string>("");

  // Quantity of Generators for Venda and Locação
  const [quantityVenda, setQuantityVenda] = useState<number>(1);
  const [quantityLocacao, setQuantityLocacao] = useState<number>(1);

  // BNDES and Financing variables
  const [bndesDownPayment, setBndesDownPayment] = useState<number>(340000); // R$ 340k
  const [bndesAnnualRate, setBndesAnnualRate] = useState<number>(0.085); // 8.5%
  const [bndesTermMonths, setBndesTermMonths] = useState<number>(60);
  const [bndesGraceMonths, setBndesGraceMonths] = useState<number>(24);
  const [vendaSplit50, setVendaSplit50] = useState<boolean>(false);
  const [factoryDiscountPercent, setFactoryDiscountPercent] = useState<number>(0);

  // Customizable Locação parameters
  const [locacaoRentPercent, setLocacaoRentPercent] = useState<number>(50); // default 50%
  const [locacaoBonusMonths, setLocacaoBonusMonths] = useState<number>(2); // default 2 months
  const [locacaoContractMonths, setLocacaoContractMonths] = useState<number>(60); // default 60 months
  const [locacaoCommissionPercent, setLocacaoCommissionPercent] = useState<number>(40); // default 40%
  const [locacaoInstallmentPercent, setLocacaoInstallmentPercent] = useState<number>(100); // default 100% signal

  // BNDES Ficha Cadastral & Documents
  const [bndesRazaoSocial, setBndesRazaoSocial] = useState<string>("Empresa Ltda");
  const [bndesCnpj, setBndesCnpj] = useState<string>("00.000.000/0001-00");
  const [bndesAnnualRevenue, setBndesAnnualRevenue] = useState<number>(18000000); // 18M R$
  const [bndesFoundedYear, setBndesFoundedYear] = useState<number>(2012);
  const [bndesMinRevenueMultiplier, setBndesMinRevenueMultiplier] = useState<number>(2);
  const [bndesMinYearsFounded, setBndesMinYearsFounded] = useState<number>(2);
  const [bndesMinDocuments, setBndesMinDocuments] = useState<number>(2);
  const [settingsDraft, setSettingsDraft] = useState<Record<string, string>>({});
  const [bndesRepresentative, setBndesRepresentative] = useState<string>("Nome do Empresário");
  const [bndesDocuments, setBndesDocuments] = useState<Array<{ id: string; name: string; size: string; status: 'Análise' | 'Aprovado' | 'Pendente'; date: string }>>([
    { id: "doc-1", name: "Balanço_Patrimonial_2024.pdf", size: "2.4 MB", status: "Aprovado", date: "30/06/2026" },
    { id: "doc-2", name: "Contrato_Social_Consolidado.pdf", size: "1.8 MB", status: "Aprovado", date: "30/06/2026" },
  ]);

  // Computed Financial Metrics
  const [financeAnalysis, setFinanceAnalysis] = useState<FinanceAnalysis | null>(null);

  // Interactive files and AI statuses
  const [ocrLoading, setOcrLoading] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [dragOver, setDragOver] = useState<boolean>(false);

  const [proposalLoading, setProposalLoading] = useState<boolean>(false);
  const [generatedProposal, setGeneratedProposal] = useState<string>("");
  const [proposalFontSize, setProposalFontSize] = useState<"sm" | "base" | "lg" | "xl">("lg");

  const [legalAuditLoading, setLegalAuditLoading] = useState<boolean>(false);
  const [legalAuditReport, setLegalAuditReport] = useState<string>("");

  // Helper to replace **bold** with actual JSX tags safely
  const renderBoldText = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    if (parts.length === 1) return text;
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-bold text-slate-950 bg-emerald-50/75 px-1 rounded">{part}</strong>;
      }
      return part;
    });
  };

  // Custom JSX renderer to parse and diagram proposals beautifully
  const renderFormattedDocument = (text: string, sizeClass: "sm" | "base" | "lg" | "xl") => {
    if (!text) return null;
    const lines = text.split("\n");
    
    const sizeMap = {
      sm: "text-xs md:text-sm leading-relaxed",
      base: "text-sm md:text-base leading-relaxed",
      lg: "text-base md:text-lg leading-relaxed font-normal",
      xl: "text-lg md:text-xl leading-relaxed font-normal"
    };

    return (
      <div className={`space-y-4 font-sans text-slate-800 ${sizeMap[sizeClass]}`}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-3" />;

          // Header level 3
          if (trimmed.startsWith("###")) {
            const content = trimmed.replace(/^###\s*/, "");
            return (
              <h3 key={idx} className="text-lg md:text-xl font-bold font-display text-emerald-800 border-b border-slate-200 pb-2 mt-6 mb-3 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-5 bg-emerald-600 rounded-sm inline-block shrink-0"></span>
                {content}
              </h3>
            );
          }

          // Header level 4
          if (trimmed.startsWith("####")) {
            const content = trimmed.replace(/^####\s*/, "");
            return (
              <h4 key={idx} className="text-base md:text-lg font-bold text-slate-900 mt-5 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-emerald-500 rounded-xs inline-block shrink-0"></span>
                {content}
              </h4>
            );
          }

          // Horizontal line
          if (trimmed === "---") {
            return <hr key={idx} className="border-t border-slate-300 my-6" />;
          }

          // List items
          if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
            const content = trimmed.replace(/^[\*\-]\s*/, "");
            return (
              <div key={idx} className="flex items-start gap-3 ml-4 my-2 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 shrink-0"></span>
                <span className="flex-1 text-slate-700">{renderBoldText(content)}</span>
              </div>
            );
          }

          // Numbered lists
          if (/^\d+\.\s+/.test(trimmed)) {
            const content = trimmed.replace(/^\d+\.\s+/, "");
            const num = trimmed.match(/^\d+/)?.[0] || "1";
            return (
              <div key={idx} className="flex items-start gap-3 ml-4 my-2 leading-relaxed">
                <span className="font-mono text-emerald-700 font-bold shrink-0 min-w-[1.2rem]">{num}.</span>
                <span className="flex-1 text-slate-700">{renderBoldText(content)}</span>
              </div>
            );
          }

          // Standard paragraph
          return (
            <p key={idx} className="leading-relaxed text-justify my-2 text-slate-700">
              {renderBoldText(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  // Toast status
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "info" | "error" }>({
    show: false,
    message: "",
    type: "success"
  });

// Support tickets for client portal — carregados do Supabase via loadClientTickets()
  const [tickets, setTickets] = useState<any[]>([]);
  
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketDesc, setNewTicketDesc] = useState("");
  const [newTicketCat, setNewTicketCat] = useState<"manutenção" | "financeiro" | "técnico" | "outros">("técnico");

  // CRM Pre-populated Leads
  const [crmLeads, setCrmLeads] = useState<CRMLead[]>([]);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadCompany, setNewLeadCompany] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadBillValue, setNewLeadBillValue] = useState("");
  const [newLeadAgent, setNewLeadAgent] = useState("");
  
  // Pre-populated Contracts
  const [contracts, setContracts] = useState<CRMContract[]>([
    { id: "CTR-501", leadId: "L-302", clientName: "Empresa Ltda", generatorKva: 500, type: "LOCACAO", value: 1700000, monthlyFee: 100000, startDate: "2026-06-25", endDate: "2031-06-25", status: "Aguardando Assinaturas", gracePeriodMonths: 36, commissionPaid: false, version: 1 }
  ]);

  const triggerToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Brasília Time State
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const bdf = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        dateStyle: "short",
        timeStyle: "medium"
      });
      setCurrentTime(bdf.format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === "admin-tickets" && portalRole === "admin") loadAdminTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, adminTicketFilter]);

  useEffect(() => {
    if (activeTab === "admin-proposals" && portalRole === "admin") {
      loadAdminProposals();
      loadAdminClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "crm" && portalRole === "admin") loadCrmLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.settings) return;
        const s = data.settings;
        if (s.bndes_annual_rate != null) setBndesAnnualRate(s.bndes_annual_rate);
        if (s.bndes_grace_months != null) setBndesGraceMonths(s.bndes_grace_months);
        if (s.factory_discount_percent != null) setFactoryDiscountPercent(s.factory_discount_percent);
        if (s.locacao_rent_percent != null) setLocacaoRentPercent(s.locacao_rent_percent);
        if (s.locacao_commission_percent != null) setLocacaoCommissionPercent(s.locacao_commission_percent);
        if (s.locacao_installment_percent != null) setLocacaoInstallmentPercent(s.locacao_installment_percent);
        if (s.bndes_min_revenue_multiplier != null) setBndesMinRevenueMultiplier(s.bndes_min_revenue_multiplier);
        if (s.bndes_min_years_founded != null) setBndesMinYearsFounded(s.bndes_min_years_founded);
        if (s.bndes_min_documents != null) setBndesMinDocuments(s.bndes_min_documents);
      })
      .catch(() => { /* mantém os valores padrão locais se a busca falhar */ });
  }, []);
   
  // PDF & Signature states
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showCatalogPrintModal, setShowCatalogPrintModal] = useState<boolean>(false);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [isRevised, setIsRevised] = useState<boolean>(false);
  const [signerCpf, setSignerCpf] = useState<string>("");
  const [signedAt, setSignedAt] = useState<string>("");
  const [showSignModal, setShowSignModal] = useState<boolean>(false);

  // Recalculate Recommendation when Bill inputs change
  useEffect(() => {
    const recommended = recommendGenerator(electricityBill.consumoKwh);
    setSelectedGenerator(recommended);
  }, [electricityBill.consumoKwh]);

  // Sync BNDES down payment to exactly 50% if vendaSplit50 is enabled (including commission split)
  useEffect(() => {
    const discountFactor = 1 - factoryDiscountPercent / 100;
    const commission = (selectedGenerator.vendaPrice * quantityVenda) * discountFactor * (locacaoCommissionPercent / 100);
    const totalWithCommission = ((selectedGenerator.vendaPrice * quantityVenda) * discountFactor) + commission;

    if (vendaSplit50) {
      setBndesDownPayment(totalWithCommission * 0.5);
    } else {
      setBndesDownPayment(prev => {
        const minVal = totalWithCommission * 0.1;
        const maxVal = totalWithCommission * 0.8;
        if (prev < minVal) return minVal;
        if (prev > maxVal) return maxVal;
        return prev;
      });
    }
  }, [vendaSplit50, selectedGenerator.vendaPrice, quantityVenda, factoryDiscountPercent, locacaoCommissionPercent]);

  // Recalculate Finance indicators when selectedGenerator, selectedOption, BNDES params, or factory discount change
  useEffect(() => {
    const analysis = performFeasibilityAnalysis(
      electricityBill,
      selectedGenerator,
      selectedOption,
      {
        downPayment: bndesDownPayment,
        annualRate: bndesAnnualRate,
        termMonths: bndesTermMonths,
        graceMonths: bndesGraceMonths
      },
      factoryDiscountPercent,
      {
        rentPercent: locacaoRentPercent,
        bonusMonths: locacaoBonusMonths,
        contractMonths: locacaoContractMonths,
        commissionPercent: locacaoCommissionPercent,
        installmentPercent: locacaoInstallmentPercent
      },
      quantityVenda,
      quantityLocacao
    );
    setFinanceAnalysis(analysis);
  }, [
    electricityBill, 
    selectedGenerator, 
    selectedOption, 
    bndesDownPayment, 
    bndesAnnualRate, 
    bndesTermMonths, 
    bndesGraceMonths, 
    factoryDiscountPercent,
    locacaoRentPercent,
    locacaoBonusMonths,
    locacaoContractMonths,
    locacaoCommissionPercent,
    locacaoInstallmentPercent,
    quantityVenda,
    quantityLocacao
  ]);

  // BNDES Document Upload handlers
  const handleBndesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newDocs = Array.from(files).map((file: any, idx) => ({
      id: `bndes-doc-${Date.now()}-${idx}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: "Análise" as const,
      date: new Date().toLocaleDateString("pt-BR")
    }));
    
    setBndesDocuments(prev => [...prev, ...newDocs]);
    triggerToast(`Documento ${files[0].name} anexado com sucesso para análise BNDES!`, "success");
    
    // Simulate automated compliance check
    setTimeout(() => {
      setBndesDocuments(prev => 
        prev.map(d => newDocs.some(nd => nd.id === d.id) ? { ...d, status: "Aprovado" as const } : d)
      );
      triggerToast(`Análise de Compliance de ${files[0].name} concluída: OK!`, "info");
    }, 2500);
  };

  const deleteBndesDoc = (id: string) => {
    setBndesDocuments(prev => prev.filter(doc => doc.id !== id));
    triggerToast("Documento removido da ficha BNDES.", "info");
  };

  // Handle OCR upload
  const handleFileUpload = async (file: File) => {
    setUploadedFileName(file.name);
    setOcrLoading(true);
    triggerToast("Analisando conta de energia por Inteligência Artificial...", "info");

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result?.toString().split(",")[1];
      try {
        const response = await fetch("/api/analyze-bill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileBase64: base64,
            mimeType: file.type
          })
        });
        const result = await response.json();
        if (result.success) {
          setElectricityBill(result.data);
          setManualValor(String(result.data.valorConta));
          setManualConsumo(String(result.data.consumoKwh));
          setManualClientName(result.data.clientName);
          if (result.note) {
            triggerToast("Leitura concluída via estimativa de contingência (cota de IA excedida).", "info");
          } else {
            triggerToast("Leitura concluída com sucesso! Dados importados.", "success");
          }
        } else {
          triggerToast("Não foi possível processar via IA. Usando estimativa segura.", "error");
        }
      } catch (err: any) {
        console.error("Erro no upload:", err);
        triggerToast("Erro de conexão. Ativando simulador de contingência.", "info");
      } finally {
        setOcrLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Handler for changes in the bill value (R$) - automatically calculates the consumption in kWh
  const handleValorChange = (valStr: string) => {
    setManualValor(valStr);
    const val = Number(valStr) || 0;
    const currentTarifa = electricityBill.tarifa || 0.75;
    const calculatedCons = Math.round(val / currentTarifa);
    setManualConsumo(String(calculatedCons));

    // Instantly update electricityBill to dimension the generator in real time!
    setElectricityBill(prev => {
      const tarifa = prev.tarifa || 0.75;
      const consumo = Math.round(val / tarifa);
      const demandaEst = Math.round(consumo / (24 * 30 * 0.5));
      
      const historico = prev.historico.map(h => {
        const factor = prev.valorConta > 0 ? val / prev.valorConta : 1;
        return {
          ...h,
          consumo: Math.round(h.consumo * (factor || 1)),
          valor: Math.round(h.valor * (factor || 1))
        };
      });

      return {
        ...prev,
        valorConta: val,
        consumoKwh: consumo,
        demanda: demandaEst || prev.demanda,
        historico
      };
    });
  };

  // Handler for changes in the consumption (kWh) - maintains consistency with the value
  const handleConsumoChange = (consStr: string) => {
    setManualConsumo(consStr);
    const cons = Number(consStr) || 0;
    const currentTarifa = electricityBill.tarifa || 0.75;
    const calculatedVal = Math.round(cons * currentTarifa);
    setManualValor(String(calculatedVal));

    // Instantly update electricityBill to dimension the generator in real time!
    setElectricityBill(prev => {
      const tarifa = prev.tarifa || 0.75;
      const val = Math.round(cons * tarifa);
      const demandaEst = Math.round(cons / (24 * 30 * 0.5));
      
      const historico = prev.historico.map(h => {
        const factor = prev.consumoKwh > 0 ? cons / prev.consumoKwh : 1;
        return {
          ...h,
          consumo: Math.round(h.consumo * (factor || 1)),
          valor: Math.round(h.valor * (factor || 1))
        };
      });

      return {
        ...prev,
        consumoKwh: cons,
        valorConta: val,
        demanda: demandaEst || prev.demanda,
        historico
      };
    });
  };

  // Submit manual inputs
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(manualValor) || 0;
    const cons = Number(manualConsumo) || 0;
    
    if (val <= 0 && cons <= 0) {
      triggerToast("Por favor, preencha o valor da conta ou consumo em kWh.", "error");
      return;
    }

    setOcrLoading(true);
    triggerToast("Aplicando parâmetros técnicos de engenharia...", "info");

    const currentTarifa = electricityBill.tarifa || 0.75;
    const finalCons = cons || Math.round(val / currentTarifa);
    const finalVal = val || Math.round(cons * currentTarifa);
    const finalTarifa = finalCons > 0 ? Number((finalVal / finalCons).toFixed(4)) : currentTarifa;
    const demandaEst = Math.round(finalCons / (24 * 30 * 0.5));

    setElectricityBill(prev => {
      const historico = prev.historico.map(h => {
        const factor = prev.consumoKwh > 0 ? finalCons / prev.consumoKwh : 1;
        return {
          ...h,
          consumo: Math.round(h.consumo * (factor || 1)),
          valor: Math.round(h.valor * (factor || 1))
        };
      });

      // Synchronize Razão Social and CNPJ
      if (manualClientName) setBndesRazaoSocial(manualClientName);
      if (manualCnpj) setBndesCnpj(manualCnpj);

      return {
        ...prev,
        clientName: manualClientName || prev.clientName,
        consumoKwh: finalCons,
        valorConta: finalVal,
        tarifa: finalTarifa,
        demanda: demandaEst || prev.demanda,
        historico
      };
    });

    setTimeout(() => {
      setOcrLoading(false);
      triggerToast("Dimensionamento recalculado com sucesso!", "success");
    }, 300);
  };

  // Clear all form inputs and generated reports
  const clearAllData = () => {
    setManualClientName("");
    setManualCnpj("");
    setManualInscEstadual("");
    setManualValor("");
    setManualConsumo("");
    setBndesRazaoSocial("");
    setBndesCnpj("");
    setGeneratedProposal("");
    setLegalAuditReport("");
    setIsRevised(false);
    triggerToast("Dados do formulário e relatórios limpos com sucesso!", "info");
  };

  const openPortal = (portal: "investidor" | "cliente") => {
    if (!portalSession) {
      setPendingPortal(portal);
      setPortalMode("login");
      setPortalLoginOpen(true);
      return;
    }
    setActiveTab(portal);
  };

  const loadClientProposals = async (session: PortalSession) => {
    const response = await fetch("/api/client-proposals", {
      method: "POST", headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (response.ok) {
      const list = (await response.json()).proposals || [];
      setClientProposals(list);
      if (list.length) setSelectedClientProposal(list[0]);
    }
  };

  const loadClientTickets = async (session: PortalSession) => {
    const response = await fetch("/api/client-tickets", {
      method: "POST", headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (response.ok) setTickets((await response.json()).tickets || []);
  };

  const checkPortalRole = async (session: PortalSession) => {
    try {
      const response = await fetch("/api/whoami", {
        method: "POST", headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (response.ok) setPortalRole((await response.json()).role || null);
    } catch { /* silencioso */ }
  };

  const loadAdminTickets = async () => {
    if (!portalSession?.access_token) return;
    const response = await fetch("/api/admin/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${portalSession.access_token}` },
      body: JSON.stringify({ status: adminTicketFilter || undefined, search: adminTicketSearch || undefined }),
    });
    if (response.ok) setAdminTickets((await response.json()).tickets || []);
    else triggerToast("Não foi possível carregar os chamados.", "error");
  };

  const submitAdminTicketUpdate = async (ticketId: string, status?: string) => {
    if (!portalSession?.access_token) return;
    const message = adminReplyDrafts[ticketId]?.trim();
    try {
      const response = await fetch("/api/admin/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${portalSession.access_token}` },
        body: JSON.stringify({ action: "reply", ticketId, message: message || undefined, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível atualizar o chamado.");
      setAdminReplyDrafts((prev) => ({ ...prev, [ticketId]: "" }));
      triggerToast("Chamado atualizado.", "success");
      await loadAdminTickets();
    } catch (error: any) {
      triggerToast(error.message || "Não foi possível atualizar o chamado.", "error");
    }
  };

  const loadAdminProposals = async () => {
    if (!portalSession?.access_token) return;
    const response = await fetch("/api/admin/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${portalSession.access_token}` },
      body: JSON.stringify({ search: adminProposalSearch || undefined }),
    });
    if (response.ok) setAdminProposals((await response.json()).proposals || []);
    else triggerToast("Não foi possível carregar as propostas.", "error");
  };

  const loadAdminClients = async () => {
    if (!portalSession?.access_token) return;
    const response = await fetch("/api/admin/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${portalSession.access_token}` },
      body: JSON.stringify({ action: "clients" }),
    });
    if (response.ok) setAdminClients((await response.json()).clients || []);
  };

  const linkProposalToClient = async (proposalId: string, clientId: string) => {
    if (!portalSession?.access_token) return;
    try {
      const response = await fetch("/api/admin/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${portalSession.access_token}` },
        body: JSON.stringify({ action: "link", proposalId, clientId: clientId || null }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível atualizar a vinculação.");
      triggerToast(clientId ? "Proposta vinculada com sucesso." : "Vinculação removida.", "success");
      await loadAdminProposals();
    } catch (error: any) {
      triggerToast(error.message || "Não foi possível atualizar a vinculação.", "error");
    }
  };
  
  const [portalPolling, setPortalPolling] = useState(false);

  const handlePortalLogout = async () => {
    try {
      if (portalSession?.access_token) {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/logout`, {
          method: "POST",
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${portalSession.access_token}`,
          },
        });
      }
    } catch {
      // mesmo se a chamada remota falhar, ainda limpamos a sessão local
    } finally {
      setPortalSession(null);
      setPortalRole(null);
      setActiveTab("dimensionador");
      triggerToast("Sessão encerrada com sucesso.", "info");
    }
  };
  
  const submitPortalAccess = async () => {
    // Validação de senha ANTES de chamar a API — evita ida e volta desnecessária
    if ((portalMode === "register" || portalMode === "login") && portalPassword.length < 6) {
      triggerToast("A senha precisa ter no mínimo 6 caracteres.", "error");
      return;
    }
  
    setPortalBusy(true);
    try {
      if (portalMode === "forgot") {
        await requestPasswordReset(portalLogin);
        triggerToast("Se o acesso existir, enviamos as instruções de redefinição.", "success");
        setPortalMode("login");
        return;
      }
  
      if (portalMode === "register") {
        await signUpPortal(portalLogin, portalPassword, portalName);
        triggerToast("Cadastro criado! Confira seu e-mail para confirmar antes de entrar.", "info");
        // Mantém "girando" e fica tentando logar sozinho, esperando a confirmação do e-mail
        setPortalPolling(true);
        const deadline = Date.now() + 5 * 60 * 1000; // tenta por até 5 minutos
        const poll = async () => {
          if (Date.now() > deadline) {
            setPortalPolling(false);
            setPortalBusy(false);
            triggerToast("Ainda não identificamos a confirmação. Tente entrar novamente após confirmar o e-mail.", "info");
            return;
          }
          try {
            const session = await signInPortal(portalLogin, portalPassword);
            if (session?.access_token) {
              setPortalSession(session);
              await checkPortalRole(session);
              if (pendingPortal === "cliente") {
                await loadClientProposals(session);
                await loadClientTickets(session);
              }
              setActiveTab(pendingPortal || "cliente");
              setPortalLoginOpen(false);
              setPortalPassword("");
              setPortalPolling(false);
              setPortalBusy(false);
              triggerToast("E-mail confirmado! Acesso liberado.", "success");
              return;
            }
          } catch {
            // ainda não confirmou — silencioso, tenta de novo
          }
          setTimeout(poll, 4000);
        };
        poll();
        return;
      }
  
      // portalMode === "login"
      const session = await signInPortal(portalLogin, portalPassword);
      if (!session?.access_token) {
        triggerToast("Confira seu e-mail para confirmar o cadastro antes de entrar.", "info");
        return;
      }
      setPortalSession(session);
      await checkPortalRole(session);
      if (pendingPortal === "cliente") {
        await loadClientProposals(session);
        await loadClientTickets(session);
      }
      setActiveTab(pendingPortal || "cliente");
      setPortalLoginOpen(false);
      setPortalPassword("");
      triggerToast("Acesso ao portal confirmado.", "success");
    } catch (error: any) {
      const msg = String(error?.message || "");
      if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already exists") || msg.toLowerCase().includes("user_already_exists")) {
        triggerToast("Este e-mail já possui cadastro. Faça login ou clique em 'Esqueci minha senha'.", "error");
      } else if (msg.toLowerCase().includes("password") && msg.toLowerCase().includes("6")) {
        triggerToast("A senha precisa ter no mínimo 6 caracteres.", "error");
      } else {
        triggerToast(msg || "Não foi possível concluir o acesso.", "error");
      }
    } finally {
      if (portalMode !== "register") setPortalBusy(false);
    }
  };

  const requestProposalEmail = (action: "generate" | "print") => {
    setProposalAction(action);
    setProposalEmail(electricityBill.clientName ? proposalEmail : "");
    setProposalEmailOpen(true);
  };

  const saveAndEmailProposal = async (email: string, content: string) => {
    const response = await fetch("/api/create-proposal", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${portalSession?.access_token}` },
      body: JSON.stringify({ email, customerName: electricityBill.clientName, proposalContent: content,
        generatorKva: selectedGenerator.capacityKva, commercialModel: selectedOption,
        investment: financeAnalysis?.investment }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível enviar a proposta.");
    triggerToast(`Proposta ${data.proposalNumber} enviada ao cliente com acesso ao portal.`, "success");
  };

  // Generate Technical & Commercial Proposal with Gemini API
  const generateProposal = (email?: string) => {
    if (!financeAnalysis) {
      triggerToast("Por favor, realize o dimensionamento primeiro no Simulador.", "info");
      setActiveTab("dimensionador");
      return;
    }
    setActiveTab("proposta");
    setProposalLoading(true);
    setGeneratedProposal("");
    triggerToast("Redigindo Proposta e Memorial Descritivo com Gemini...", "info");

    fetch("/api/generate-proposal", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${portalSession?.access_token}` },
      body: JSON.stringify({
        clientData: electricityBill,
        generatorData: {
          capacityKva: selectedGenerator.capacityKva,
          price: selectedOption === "venda" ? selectedGenerator.vendaPrice : selectedGenerator.locacaoRefPrice,
          powerKw: selectedGenerator.powerKw,
          generationKwh: selectedGenerator.generationKwh,
          coveragePercent: Math.min(100, Math.round((selectedGenerator.generationKwh / electricityBill.consumoKwh) * 100))
        },
        financeData: {
          investment: financeAnalysis.investment,
          monthlySavings: financeAnalysis.monthlySavings,
          clientPayment: financeAnalysis.clientPayment,
          paybackSimple: financeAnalysis.paybackSimple,
          gargantuaGracePeriod: financeAnalysis.gargantuaGracePeriod,
          factoryDiscountPercent: factoryDiscountPercent,
          locacaoParams: {
            rentPercent: locacaoRentPercent,
            bonusMonths: locacaoBonusMonths,
            contractMonths: locacaoContractMonths,
            commissionPercent: locacaoCommissionPercent,
            installmentPercent: locacaoInstallmentPercent
          },
          bndesParams: {
            downPayment: bndesDownPayment,
            annualRate: bndesAnnualRate,
            termMonths: bndesTermMonths,
            graceMonths: bndesGraceMonths,
            vendaSplit50: vendaSplit50
          }
        },
        selectedOption: selectedOption
      })
    })
      .then(res => res.json())
      .then(data => {
        // Aceita se o status for de sucesso vindo da Vercel
        if (data.success || data.text) {
          // Garante a leitura correta independente do nome da propriedade vinda da Vercel
          const proposalContent = data.content || data.text;
          setGeneratedProposal(proposalContent);
          
          if (data.isFallback || data.note) {
            triggerToast("Proposta gerada via motor de contingência local (cota de IA excedida).", "info");
          } else {
            triggerToast("Proposta estruturada criada com sucesso!", "success");
          }
          // Caso seu estado seja diferente de setShowPrintModal, mantenha como estava seu original
          if (email) {
            saveAndEmailProposal(email, proposalContent).catch((error) => triggerToast(error.message, "error"));
          }
          if (typeof setShowPrintModal === "function") {
            setShowPrintModal(true);
          }
        } else {
          triggerToast("Erro ao gerar proposta comercial.", "error");
        }
      })
      .catch(err => {
        console.error(err);
        triggerToast("Erro ao gerar proposta comercial.", "error");
      })
      .finally(() => {
        setProposalLoading(false);
      });
  };

  // Generate and download/print proposal as a beautiful PDF
  const downloadProposalPDF = () => {
    if (!generatedProposal) {
      triggerToast("Por favor, gere a proposta primeiro clicando em 'Redigir Proposta'.", "info");
      return;
    }
    setShowPrintModal(true);
  };

  const downloadHTMLProposal = () => {
        const cleanedProposal = generatedProposal.split("\n").filter(line => {
      const trimmed = line.trim();
      const lower = trimmed.toLowerCase();
      if (lower.includes("capa:") || lower.includes("1. capa") || lower.includes("capa octa") || lower.includes("código de referência") || lower.includes("destinatário:") || lower.includes("proponente:") || lower.includes("data de emissão")) {
        return false;
      }
      if (trimmed.startsWith("## ") && (lower.includes("capa") || lower.includes("proposta"))) {
        return false;
      }
      return true;
    }).join("\n");

    const formattedContent = cleanedProposal
      .replace(/### (.*)/g, '<h3 style="color: #1e3a8a; font-size: 18px; font-weight: 700; margin-top: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; font-family: \'Space Grotesk\', sans-serif;">$1</h3>')
      .replace(/#### (.*)/g, '<h4 style="color: #0f172a; font-size: 15px; font-weight: 700; margin-top: 16px; margin-bottom: 6px; font-family: sans-serif;">$1</h4>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #0f172a; background-color: rgba(30, 58, 138, 0.05); padding: 1px 4px; border-radius: 4px; border: 1px solid rgba(30, 58, 138, 0.1);">$1</strong>')
      .replace(/\* (.*)/g, '<div style="display: flex; align-items: start; gap: 8px; margin-left: 16px; margin-bottom: 8px; font-size: 13px; color: #475569;"><span style="color: #1d4ed8; font-size: 14px; line-height: 1;">•</span><span>$1</span></div>')
      .replace(/\n/g, '<br>');

    const formattedAudit = legalAuditReport
      ? legalAuditReport
          .replace(/### (.*)/g, '<h3 style="color: #1e3a8a; font-size: 18px; font-weight: 700; margin-top: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; font-family: \'Space Grotesk\', sans-serif;">$1</h3>')
          .replace(/#### (.*)/g, '<h4 style="color: #0f172a; font-size: 15px; font-weight: 700; margin-top: 16px; margin-bottom: 6px; font-family: sans-serif;">$1</h4>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #0f172a; background-color: rgba(30, 58, 138, 0.05); padding: 1px 4px; border-radius: 4px; border: 1px solid rgba(30, 58, 138, 0.1);">$1</strong>')
          .replace(/\* (.*)/g, '<div style="display: flex; align-items: start; gap: 8px; margin-left: 16px; margin-bottom: 8px; font-size: 12px; color: #475569;"><span style="color: #1d4ed8; font-size: 14px; line-height: 1;">•</span><span>$1</span></div>')
          .replace(/\n/g, '<br>')
      : "";

    const currentDateStr = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    const logoSvgHtml = `
<svg viewBox="0 0 100 100" style="width: 64px; height: 64px; display: block;" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e40af" />
      <stop offset="50%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <linearGradient id="gGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="50%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>
    <linearGradient id="cGrad" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0891b2" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="44" stroke="#60a5fa" stroke-width="0.75" stroke-dasharray="4 4" opacity="0.3" />
  <circle cx="50" cy="50" r="48" stroke="#34d399" stroke-width="0.5" stroke-dasharray="2 6" opacity="0.4" />
  <path d="M50 12 C64 12 78 24 82 40 C86 56 74 76 58 84 C46 90 30 84 22 72 C16 60 20 44 32 34 C40 26 50 12 50 12 Z" fill="url(#bGrad)" opacity="0.9" />
  <path d="M50 88 C36 88 22 76 18 60 C14 44 26 24 42 16 C54 10 70 16 78 28 C84 40 80 56 68 66 C60 74 50 88 50 88 Z" fill="url(#gGrad)" opacity="0.95" />
  <path d="M35 35 C45 22 65 20 75 30 C81 36 81 48 73 58 C65 68 49 70 39 60 C33 54 31 44 35 35 Z" fill="url(#cGrad)" opacity="0.8" />
  <circle cx="50" cy="50" r="15" fill="white" />
  <circle cx="50" cy="50" r="10" fill="url(#bGrad)" />
</svg>
    `;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Proposta Comercial - OCTA ENERGY</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;700&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      background: #f1f5f9;
      color: #334155;
    }
    .page {
      background: #ffffff;
      width: 210mm;
      min-height: 297mm;
      box-sizing: border-box;
      padding: 50px 60px;
      margin: 40px auto;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }
    /* Elegant outer moldura / frame inside page */
    .page::before {
      content: "";
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 1px solid rgba(30, 58, 138, 0.1);
      border-radius: 12px;
      pointer-events: none;
      z-index: 5;
    }
    .page::after {
      content: "";
      position: absolute;
      top: 24px;
      left: 24px;
      right: 24px;
      bottom: 24px;
      border: 2px solid rgba(30, 58, 138, 0.05);
      border-radius: 8px;
      pointer-events: none;
      z-index: 5;
    }
    /* Subtle decorative ticks on inner corners */
    .corner-tick {
      position: absolute;
      width: 16px;
      height: 16px;
      z-index: 6;
      pointer-events: none;
    }
    .corner-tl { top: 24px; left: 24px; border-top: 2px solid rgba(30, 58, 138, 0.25); border-left: 2px solid rgba(30, 58, 138, 0.25); }
    .corner-tr { top: 24px; right: 24px; border-top: 2px solid rgba(30, 58, 138, 0.25); border-right: 2px solid rgba(30, 58, 138, 0.25); }
    .corner-bl { bottom: 24px; left: 24px; border-bottom: 2px solid rgba(30, 58, 138, 0.25); border-left: 2px solid rgba(30, 58, 138, 0.25); }
    .corner-br { bottom: 24px; right: 24px; border-bottom: 2px solid rgba(30, 58, 138, 0.25); border-right: 2px solid rgba(30, 58, 138, 0.25); }

    /* Cover Page Custom Moldura */
    .cover-page {
      background: linear-gradient(135deg, #0f172a 0%, #020617 50%, #1e3a8a 100%);
      color: #ffffff;
    }
    .cover-page::before {
      border: 1px solid rgba(52, 211, 153, 0.25);
    }
    .cover-page::after {
      border: 2px solid rgba(255, 255, 255, 0.08);
    }
    .cover-corner-tl { top: 24px; left: 24px; border-top: 2px solid rgba(52, 211, 153, 0.35); border-left: 2px solid rgba(52, 211, 153, 0.35); }
    .cover-corner-tr { top: 24px; right: 24px; border-top: 2px solid rgba(52, 211, 153, 0.35); border-right: 2px solid rgba(52, 211, 153, 0.35); }
    .cover-corner-bl { bottom: 24px; left: 24px; border-bottom: 2px solid rgba(52, 211, 153, 0.35); border-left: 2px solid rgba(52, 211, 153, 0.35); }
    .cover-corner-br { bottom: 24px; right: 24px; border-bottom: 2px solid rgba(52, 211, 153, 0.35); border-right: 2px solid rgba(52, 211, 153, 0.35); }

    /* Premium Header Box (Caixa Azul) */
    .premium-header-box {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
      border: 1px solid #1d4ed8;
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(30, 58, 138, 0.15);
      margin-bottom: 30px;
      position: relative;
    }
    .premium-header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logo-wrapper {
      background: #ffffff;
      padding: 4px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #bfdbfe;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .title-large {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 900;
      font-size: 38px;
      line-height: 1.1;
      margin: 20px 0;
      letter-spacing: -1px;
    }
    .address-box {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 20px;
      margin-top: 30px;
      font-size: 13px;
    }
    .address-line {
      display: flex;
      margin-bottom: 8px;
    }
    .address-label {
      width: 60px;
      color: #94a3b8;
      font-family: monospace;
    }
    .address-val {
      color: #ffffff;
      font-weight: 600;
    }
    .advantages-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 35px;
    }
    .adv-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
    }
    .adv-title {
      font-weight: bold;
      color: #0f172a;
      font-size: 13px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .adv-desc {
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
    }
    .signatures {
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 25px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
    .sig-block {
      text-align: center;
    }
    .sig-line {
      width: 180px;
      border-bottom: 1px solid #cbd5e1;
      margin: 10px auto;
    }
    .sig-name {
      font-size: 11px;
      font-weight: bold;
      color: #0f172a;
    }
    .sig-role {
      font-size: 9px;
      color: #64748b;
    }
    .sig-badge {
      display: inline-block;
      font-size: 8px;
      font-weight: bold;
      color: #1e40af;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 2px 8px;
      border-radius: 4px;
      margin-top: 8px;
      text-transform: uppercase;
    }
    @media print {
      body {
        background: #fff;
      }
      .page {
        margin: 0;
        box-shadow: none;
        page-break-after: always;
        break-after: page;
      }
    }
  </style>
</head>
<body>

  <!-- PAGE 1: CAPA -->
  <div class="page cover-page">
    <div class="corner-tick cover-corner-tl"></div>
    <div class="corner-tick cover-corner-tr"></div>
    <div class="corner-tick cover-corner-bl"></div>
    <div class="corner-tick cover-corner-br"></div>

    <div style="display: flex; justify-content: space-between; align-items: start; position: relative; z-index: 10;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          ${logoSvgHtml}
        </div>
        <div>
          <span style="font-size: 26px; font-weight: 900; letter-spacing: 1px; color: #ffffff;">OCTA ENERGY</span>
          <div style="font-size: 9px; font-family: monospace; color: #94a3b8; margin-top: 4px; letter-spacing: 2px; text-transform: uppercase;">TECNOLOGIA DE TRANSIÇÃO ENERGÉTICA</div>
        </div>
      </div>
      <div style="text-align: right; font-family: monospace; font-size: 9px; color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 8px;">
        REF: PROP-OCTA-${selectedGenerator.capacityKva}KVA<br>
        STATUS: PROPOSTA EXECUTIVA
      </div>
    </div>

    <div style="margin: auto 0; max-width: 550px; position: relative; z-index: 10;">
      <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #34d399; background: rgba(52, 211, 153, 0.1); border: 1px solid rgba(52, 211, 153, 0.2); padding: 4px 10px; border-radius: 99px;">Estudo de Viabilidade Técnico-Comercial</span>
      <h1 class="title-large">PROPOSTA DE INDEPENDÊNCIA ENERGÉTICA</h1>
      <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-top: 15px;">
        Implantação assistida de Gerador Cinético Magnético Magnestor de alta performance com pegada de carbono zero e 100% de estabilidade de base.
      </p>
      
      <div style="display: flex; gap: 15px; margin-top: 25px;">
        <div style="background: rgba(15, 23, 42, 0.8); padding: 10px 18px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.08);">
          <span style="font-size: 9px; color: #94a3b8; display: block; font-family: monospace;">CAPACIDADE</span>
          <span style="font-size: 16px; font-weight: bold; color: #34d399;">${selectedGenerator.capacityKva} KVA</span>
        </div>
        <div style="background: rgba(15, 23, 42, 0.8); padding: 10px 18px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.08);">
          <span style="font-size: 9px; color: #94a3b8; display: block; font-family: monospace;">POTÊNCIA</span>
          <span style="font-size: 16px; font-weight: bold; color: #34d399;">${selectedGenerator.powerKw} kW</span>
        </div>
        <div style="background: rgba(15, 23, 42, 0.8); padding: 10px 18px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.08);">
          <span style="font-size: 9px; color: #94a3b8; display: block; font-family: monospace;">RETORNO</span>
          <span style="font-size: 16px; font-weight: bold; color: #34d399;">${selectedOption === "venda" ? `${financeAnalysis?.paybackSimple || 36} Meses` : "Imediato"}</span>
        </div>
      </div>
    </div>

    <div class="address-box" style="position: relative; z-index: 10;">
      <div style="font-size: 9px; font-weight: bold; color: #94a3b8; margin-bottom: 12px; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px;">DESTINATÁRIO & ENDEREÇAMENTO</div>
      <div class="address-line">
        <span class="address-label">Para:</span>
        <span class="address-val">${electricityBill.clientName || "Cliente Corporativo S/A"}</span>
      </div>
      <div class="address-line">
        <span class="address-label">De:</span>
        <span class="address-val" style="color: #34d399;">OCTA ENERGY S/A</span>
      </div>
      <div class="address-line">
        <span class="address-label">Data:</span>
        <span class="address-val">${currentDateStr}</span>
      </div>
    </div>
  </div>

  <!-- PAGE 2: TECNOLOGIA & DIFERENCIAIS -->
  <div class="page">
    <div class="corner-tick corner-tl"></div>
    <div class="corner-tick corner-tr"></div>
    <div class="corner-tick corner-bl"></div>
    <div class="corner-tick corner-br"></div>

    <!-- Blue Header Box with Logo on the left -->
    <div class="premium-header-box">
      <div class="premium-header-left">
        <div class="logo-wrapper">
          ${logoSvgHtml}
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px; font-weight: 900; letter-spacing: 1px;">OCTA ENERGY</span>
            <span style="font-size: 8px; font-weight: bold; background: rgba(52,211,153,0.2); color: #34d399; border: 1px solid rgba(52,211,153,0.3); padding: 1px 6px; border-radius: 4px; text-transform: uppercase;">ECOLÓGICO</span>
          </div>
          <div style="font-size: 9px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1.5px; font-family: monospace; margin-top: 2px;">Soluções de Autonomia Energética</div>
        </div>
      </div>
      <div style="text-align: right; font-family: monospace; font-size: 8px; color: #93c5fd; border-left: 1px solid rgba(255,255,255,0.15); padding-left: 15px; line-height: 1.4;">
        <strong style="color: #ffffff; font-size: 9px; text-transform: uppercase;">Estudo Técnico-Comercial</strong><br>
        REF: PROP-OCTA-${selectedGenerator.capacityKva}KVA<br>
        VALIDADE: 30 DIAS
      </div>
    </div>

    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 10;">
      <span style="font-size: 10px; font-weight: bold; color: #1e3a8a; font-family: monospace; text-transform: uppercase;">Seção 01</span>
      <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 22px; color: #0f172a; margin-top: 5px; margin-bottom: 15px;">1. Tecnologia Cinética Magnética Eco-Eficiente</h2>
      
      <p style="font-size: 13px; line-height: 1.6; color: #475569; text-align: justify; margin-bottom: 15px;">
        A tecnologia desenvolvida pela <strong>OCTA ENERGY</strong> representa o ápice da engenharia eletromecânica aplicada à sustentabilidade e transição energética. Diferente dos geradores solares ou eólicos que sofrem com as flutuações e intermitências climáticas, ou dos motogeradores a combustão que demandam a queima constante de óleo diesel ou gás e emitem ruídos nocivos e dióxido de carbono, o <strong>Gerador Cinético Magnético OCTA</strong> opera em regime de <strong>Base Load absoluto (24 horas por dia, 7 dias por semana)</strong>.
      </p>
      <p style="font-size: 13px; line-height: 1.6; color: #475569; text-align: justify; margin-bottom: 25px;">
        O princípio operacional baseia-se na sustentação e amplificação de torque por acoplamento magnético e indução eletromagnética de alta eficiência. Utilizando superímãs de neodímio sob arranjo geométrico otimizado e mananciais de levitação magnética com atrito quase nulo, o gerador garante um rendimento constante de <strong>97%</strong>.
      </p>

      <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #0f172a; letter-spacing: 1px; margin-bottom: 15px;">Vantagens Competitivas e Diferenciais:</div>
      
      <div class="advantages-grid">
        <div class="adv-card">
          <div class="adv-title">Autonomia Base Load 24/7</div>
          <div class="adv-desc">Operação ininterrupta em qualquer condição meteorológica. Sem riscos de falta de vento ou noite, garantindo estabilidade total da voltagem para maquinários sensíveis.</div>
        </div>
        <div class="adv-card">
          <div class="adv-title">Custo Zero de Combustível</div>
          <div class="adv-desc">Independência total de flutuações de preços internacionais de petróleo ou gás natural. O combustível é o próprio movimento cinético assistido por acoplamento magnético.</div>
        </div>
        <div class="adv-card">
          <div class="adv-title">Pegada Ecológica Zero</div>
          <div class="adv-desc">Perfeitamente alinhado com as metas corporativas ESG. Sem queima de hidrocarbonetos, sem emissão de monóxido de carbono e totalmente reciclável ao final da vida útil.</div>
        </div>
        <div class="adv-card">
          <div class="adv-title">Durabilidade Industrial</div>
          <div class="adv-desc">Estrutura mecânica projetada para 20 anos de operação produtiva. Mancais de levitação reduzem o desgaste de fricção a patamares praticamente insignificantes.</div>
        </div>
      </div>
    </div>

    <div class="page-footer" style="position: relative; z-index: 10;">
      <span>OCTA ENERGY S/A • Fortaleza, Ceará, Brasil</span>
      <span>Página 2 de 3</span>
    </div>
  </div>

  <!-- PAGE 3: CORPO DA PROPOSTA, CLAUSULAS E ASSINATURAS -->
  <div class="page">
    <div class="corner-tick corner-tl"></div>
    <div class="corner-tick corner-tr"></div>
    <div class="corner-tick corner-bl"></div>
    <div class="corner-tick corner-br"></div>

    <!-- Blue Header Box with Logo on the left -->
    <div class="premium-header-box">
      <div class="premium-header-left">
        <div class="logo-wrapper">
          ${logoSvgHtml}
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px; font-weight: 900; letter-spacing: 1px;">OCTA ENERGY</span>
            <span style="font-size: 8px; font-weight: bold; background: rgba(52,211,153,0.2); color: #34d399; border: 1px solid rgba(52,211,153,0.3); padding: 1px 6px; border-radius: 4px; text-transform: uppercase;">ECOLÓGICO</span>
          </div>
          <div style="font-size: 9px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1.5px; font-family: monospace; margin-top: 2px;">Soluções de Autonomia Energética</div>
        </div>
      </div>
      <div style="text-align: right; font-family: monospace; font-size: 8px; color: #93c5fd; border-left: 1px solid rgba(255,255,255,0.15); padding-left: 15px; line-height: 1.4;">
        <strong style="color: #ffffff; font-size: 9px; text-transform: uppercase;">Memorial Técnico & Condições</strong><br>
        REF: PROP-OCTA-${selectedGenerator.capacityKva}KVA<br>
        VALIDADE: 30 DIAS
      </div>
    </div>

    <div style="flex: 1; position: relative; z-index: 10;">
      <span style="font-size: 10px; font-weight: bold; color: #1e3a8a; font-family: monospace; text-transform: uppercase;">Seção 02</span>
      <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 22px; color: #0f172a; margin-top: 5px; margin-bottom: 15px;">2. Proposta Financeira & Detalhes do Negócio</h2>
      
      <div style="font-size: 13px; line-height: 1.6; color: #475569; background: #f8fafc; border: 1px solid #f1f5f9; padding: 20px; border-radius: 12px; max-height: 350px; overflow-y: auto;">
        ${formattedContent}
      </div>

      ${formattedAudit ? `
      <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        <span style="font-size: 9px; font-weight: bold; background-color: rgba(30, 58, 138, 0.05); color: #1e3a8a; padding: 4px 10px; border-radius: 99px; text-transform: uppercase;">Parecer Técnico-Jurídico</span>
        <div style="font-size: 12px; color: #475569; margin-top: 10px; background: #faf5ff; border: 1px solid #f3e8ff; padding: 15px; border-radius: 8px;">
          ${formattedAudit}
        </div>
      </div>
      ` : ""}

      <!-- Acceptance and Fabrication Terms -->
      ${(selectedOption === "locacao" || (selectedOption === "venda" && vendaSplit50)) ? `
      <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px; background: #fafdfb; border: 1px solid #e6f4ea; padding: 15px; border-radius: 10px;">
        <h5 style="font-size: 10px; font-weight: bold; color: #1e3a8a; text-transform: uppercase; margin: 0 0 6px 0;">Cláusula de Aceite Formal & Regra de Fabricação</h5>
        <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; line-height: 1.5;">
          O custo estrutural de fabricação e montagem do equipamento é lastreado pelo fluxo de caixa acordado conforme a <strong>Regra de Fabricação (Aporte de Mobilização)</strong>:
        </p>
        <div style="font-size: 11px; font-family: monospace; color: #1e3a8a; background: #ffffff; padding: 10px; border: 1px solid #dadce0; border-radius: 6px;">
          ${selectedOption === "venda" ? `
            <strong>Aporte de Entrada (50%):</strong> R$ ${bndesDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pago no ato do pedido.<br>
            <strong>Saldo na Entrega (50%):</strong> R$ ${bndesDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pago mediante a entrega física.
          ` : `
            <strong>Sinal de Fabricação (${locacaoInstallmentPercent}%):</strong> R$ ${((financeAnalysis?.investment || 0) * (locacaoInstallmentPercent / 100)).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pago no ato da assinatura.
          `}
        </div>
      </div>
      ` : ""}

      <!-- Signatures Grid -->
      <div class="signatures">
        <div class="sig-block">
          <div style="font-style: italic; color: #1e3a8a; font-weight: bold; font-size: 14px; margin-bottom: 2px;">Cássio Vale</div>
          <div class="sig-line"></div>
          <div class="sig-name">Cássio Vale</div>
          <div class="sig-role">Diretor de Engenharia • OCTA ENERGY</div>
          <div class="sig-badge">Assinado Eletronicamente</div>
        </div>
        <div class="sig-block">
          <div style="font-style: italic; color: #1e3a8a; font-weight: bold; font-size: 14px; margin-bottom: 2px;">
            ${isSigned ? (electricityBill.clientName || "Representante Autorizado") : "&nbsp;"}
          </div>
          <div class="sig-line" style="${isSigned ? 'border-color: #1e3a8a;' : 'border-style: dashed;'}"></div>
          <div class="sig-name">${electricityBill.clientName || "Representante Autorizado"}</div>
          <div class="sig-role">Cliente Contratante</div>
          ${isSigned ? `
            <div class="sig-badge">Assinado via ICP-Brasil</div>
            <div style="font-size: 8px; color: #94a3b8; font-family: monospace; margin-top: 4px;">CPF/CNPJ: ${signerCpf}</div>
            <div style="font-size: 8px; color: #94a3b8; font-family: monospace;">${signedAt}</div>
          ` : '<div class="sig-badge" style="background-color: #f8fafc; color: #64748b; border-color: #cbd5e1;">Pendente ICP-Brasil</div>'}
        </div>
      </div>
    </div>

    <div class="page-footer" style="position: relative; z-index: 10;">
      <span>OCTA ENERGY S/A • www.octaenergy.com.br • SAC: 0800-OCTA-900</span>
      <span>Página 3 de 3</span>
    </div>
  </div>

</body>
</html>
    `;

    const element = document.createElement("a");
    const file = new Blob([htmlContent], {type: 'text/html;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `Proposta_Comercial_OCTA_${selectedGenerator.capacityKva}KVA.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast("Proposta exportada em HTML Executivo com sucesso!", "success");
  };

  // Generate and download proposal in DOCX (MS Word .doc format)
  const downloadDOCXProposal = () => {
    if (!generatedProposal) {
      triggerToast("Por favor, gere a proposta primeiro.", "info");
      return;
    }
    
    const formattedContent = generatedProposal
      .replace(/### (.*)/g, '<h3 style="color: #047857; font-size: 18px; font-weight: bold; margin-top: 18px; border-bottom: 2px solid #059669; padding-bottom: 4px; font-family: Arial, sans-serif;">$1</h3>')
      .replace(/#### (.*)/g, '<h4 style="color: #1e293b; font-size: 14px; font-weight: bold; margin-top: 12px; margin-bottom: 4px; font-family: Arial, sans-serif;">$1</h4>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\* (.*)/g, '<li style="margin-left: 20px; font-size: 12px; color: #334155; margin-bottom: 4px;">$1</li>')
      .replace(/\n/g, '<br>');

    const docHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>Proposta Oficial - OCTA ENERGY</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #334155;
      padding: 40px;
    }
    h1 {
      color: #064e3b;
      font-size: 24px;
      font-weight: bold;
      border-bottom: 3px solid #059669;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    h3 {
      color: #047857;
      font-size: 16px;
      font-weight: bold;
      border-bottom: 1px solid #a7f3d0;
      padding-bottom: 4px;
      margin-top: 20px;
    }
    h4 {
      color: #1e293b;
      font-size: 12px;
      font-weight: bold;
      margin-top: 15px;
    }
    strong {
      color: #0f172a;
    }
  </style>
</head>
<body>
  <h1>PROPOSTA TÉCNICO-COMERCIAL DE LOCAÇÃO ESTRUTURADA DE ATIVO ENERGÉTICO</h1>
  <p><strong>Código de Referência:</strong> OCTA-LOC-2026-${selectedGenerator.capacityKva}KVA-POCONE</p>
  <p><strong>Destinatário:</strong> Sr. Tadeu / Mineração – Poconé</p>
  <p><strong>Proponente:</strong> OCTA ENERGIA LTDA</p>
  <p><strong>Data de Emissão (Sincronizada):</strong> 3 de julho de 2026 às 12:28 (Horário de Brasília)</p>
  ${isRevised ? '<p style="color: #4f46e5; font-weight: bold; font-size: 12pt;">[STATUS: PROPOSTA REVISADA OFICIALMENTE]</p>' : ''}
  <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;">
  
  <div class="content-area">
    ${formattedContent}
  </div>
</body>
</html>
    `;

    const blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Proposta_Comercial_OCTA_${selectedGenerator.capacityKva}KVA.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast("Proposta DOC (Word) baixada com sucesso!", "success");
  };

  // Export current dimensioning and financial data to a CSV file
  const downloadCSVProposal = () => {
    if (!financeAnalysis) {
      triggerToast("Por favor, realize o dimensionamento primeiro.", "info");
      return;
    }

    const rows: string[][] = [
      ["PROPOSTA COMERCIAL OCTA ENERGY - EXPORTAÇÃO DE DADOS FINANCEIROS & DIMENSIONAMENTO"],
      [`Data de Exportação;${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`],
      [""],
      ["1. DADOS DO CLIENTE & CONTA DE ENERGIA"],
      ["Parâmetro;Valor"],
      [`Nome do Cliente;${electricityBill.clientName || ""}`],
      [`Consumo Mensal Base;${electricityBill.consumoKwh} kWh`],
      [`Tarifa de Energia;R$ ${electricityBill.tarifa.toLocaleString("pt-BR", { minimumFractionDigits: 4 })}`],
      [`Valor da Conta de Energia Base;R$ ${electricityBill.valorConta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
      [`Demanda Contratada;${electricityBill.demanda ? electricityBill.demanda + " kW" : "N/D"}`],
      [`Bandeira Tarifária;${electricityBill.bandeira || "Verde"}`],
      [`ICMS;${electricityBill.icms || 0} %`],
      [`PIS;${electricityBill.pis || 0} %`],
      [`COFINS;${electricityBill.cofins || 0} %`],
      [""],
      ["2. DIMENSIONAMENTO DO GERADOR CINÉTICO"],
      ["Métrica;Valor"],
      [`Modelo de Referência;${selectedGenerator.name || ""}`],
      [`Quantidade Selecionada;${selectedOption === "venda" ? quantityVenda : quantityLocacao} unidade(s)`],
      [`Capacidade Sizing Unitária;${selectedGenerator.capacityKva} KVA`],
      [`Capacidade Sizing Total;${selectedGenerator.capacityKva * (selectedOption === "venda" ? quantityVenda : quantityLocacao)} KVA`],
      [`Potência Útil Unitária;${selectedGenerator.powerKw} kW`],
      [`Potência Útil Total;${selectedGenerator.powerKw * (selectedOption === "venda" ? quantityVenda : quantityLocacao)} kW`],
      [`Geração Mensal Unitária;${selectedGenerator.generationKwh.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} kWh`],
      [`Geração Mensal Total;${(selectedGenerator.generationKwh * (selectedOption === "venda" ? quantityVenda : quantityLocacao)).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} kWh`],
      [`Eficiência (Rendimento);${selectedGenerator.rendimento || "97%"}`],
      [`Espaço Requerido;${selectedGenerator.area || "N/D"}`],
      [`Tensão de Saída;${selectedGenerator.voltagem || "N/D"}`],
      [`Vida Útil de Projeto;20 Anos`],
      [`Garantia Estrutural;5 Anos`],
      [""],
      ["3. ANÁLISE ECONÔMICO-FINANCEIRA (VIABILIDADE)"],
      ["Métrica;Valor"],
      [`Modalidade de Negócio;${selectedOption === "venda" ? "Venda Direta / Financiamento" : "Locação Estruturada"}`],
      [`Investimento Total Estimado;R$ ${financeAnalysis.investment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
      [`Economia Mensal Estimada na Conta de Energia;R$ ${financeAnalysis.monthlySavings.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
      [`Valor da Parcela/Aluguel Mensal;R$ ${financeAnalysis.clientPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
      [`Payback Simples do Projeto;${financeAnalysis.paybackSimple.toLocaleString("pt-BR")} Meses`],
      [`Payback Descontado Estimado;${financeAnalysis.paybackDiscounted.toLocaleString("pt-BR")} Meses`],
      [`Período de Carência Assegurada;${financeAnalysis.gargantuaGracePeriod} Meses`],
      [`Taxa Interna de Retorno (TIR);${(financeAnalysis.tir * 100).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% a.a.`],
      [`Valor Presente Líquido (VPL a 12% a.a.);R$ ${financeAnalysis.vpl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
      [`Retorno Sobre Investimento (ROI);${financeAnalysis.roi.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`],
      [`EBITDA Anualizado Operacional;R$ ${financeAnalysis.ebitda.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
      [`Comissão do Consultor / Parceiro;R$ ${financeAnalysis.commission.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
      [""],
      ["4. CRONOGRAMA DE FLUXO DE CAIXA MÊS A MÊS"]
    ];

    // Build Cash Flow Table
    rows.push(["Mês", "Tipo de Período", "Entradas (R$)", "Saídas (R$)", "Fluxo Líquido (R$)", "Fluxo Acumulado (R$)"]);
    
    const grace = financeAnalysis.gargantuaGracePeriod;
    const contractMonths = selectedOption === "venda" ? bndesTermMonths : locacaoContractMonths;

    let accumulated = -financeAnalysis.investment;
    rows.push([
      "0",
      "Aporte Inicial",
      "0,00",
      financeAnalysis.investment.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      (-financeAnalysis.investment).toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      accumulated.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
    ]);

    for (let m = 1; m <= grace; m++) {
      const inflow = 0;
      const outflow = 0;
      const net = 0;
      accumulated += net;
      rows.push([
        m.toString(),
        "Carência de Fabricação / Bônus",
        inflow.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
        outflow.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
        net.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
        accumulated.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
      ]);
    }

    for (let m = 1; m <= contractMonths; m++) {
      const monthIndex = grace + m;
      const inflow = financeAnalysis.clientPayment;
      const outflow = 0;
      const net = inflow;
      accumulated += net;
      rows.push([
        monthIndex.toString(),
        "Período de Contrato Ativo",
        inflow.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
        outflow.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
        net.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
        accumulated.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
      ]);
    }

    if (selectedOption === "venda" && financeAnalysis.bndesSimulation) {
      rows.push([""]);
      rows.push(["5. DETALHES DO FINANCIAMENTO BNDES SIMULADO"]);
      rows.push(["Parâmetro;Valor"]);
      rows.push([`Valor Financiado;R$ ${(financeAnalysis.investment - bndesDownPayment).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`]);
      rows.push([`Aporte de Entrada (Sinal);R$ ${bndesDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`]);
      rows.push([`Taxa de Juros Anual;${(bndesAnnualRate * 100).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% a.a.`]);
      rows.push([`Prazo Total;${bndesTermMonths} Meses`]);
      rows.push([`Prazo de Carência;${bndesGraceMonths} Meses`]);
      rows.push([`Média das Parcelas;R$ ${financeAnalysis.bndesSimulation.monthlyPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`]);
      rows.push([`Total de Juros Pagos;R$ ${financeAnalysis.bndesSimulation.totalInterest.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`]);
      
      rows.push([""]);
      rows.push(["6. CRONOGRAMA DE AMORTIZAÇÃO BNDES FINAME (SAC)"]);
      rows.push(["Mês", "Parcela (R$)", "Amortização (R$)", "Juros (R$)", "Saldo Devedor (R$)"]);
      financeAnalysis.bndesSimulation.amortizationSchedule.forEach((sched) => {
        rows.push([
          sched.month.toString(),
          sched.payment.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
          sched.amortization.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
          sched.interest.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
          sched.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        ]);
      });
    }

    // Convert rows to CSV string with properly quoted elements if they contain special characters
    const csvContent = rows
      .map((row) => {
        return row
          .map((val) => {
            const str = String(val);
            if (str.includes(";") || str.includes("\n") || str.includes('"')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(";");
      })
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Estudo_Financeiro_OCTA_${selectedGenerator.capacityKva}KVA.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast("Estudo financeiro e dimensionamento exportados em CSV com sucesso!", "success");
  };

  // Perform Legal AI Contract Audit
  const handleLegalAudit = () => {
    if (!financeAnalysis) return;
    setLegalAuditLoading(true);
    setLegalAuditReport("");
    triggerToast("Iniciando auditoria de compliance contratual...", "info");

    fetch("/api/analyze-contract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contractText: {
          selectedOption,
          gracePeriod: financeAnalysis.gargantuaGracePeriod,
          payback: financeAnalysis.paybackSimple,
          monthlyFee: financeAnalysis.clientPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
          generatorKva: selectedGenerator.capacityKva,
          investment: financeAnalysis.investment,
          commission: financeAnalysis.commission,
          bndesParams: {
            downPayment: bndesDownPayment,
            annualRate: bndesAnnualRate,
            termMonths: bndesTermMonths,
            graceMonths: bndesGraceMonths,
            vendaSplit50: vendaSplit50
          }
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLegalAuditReport(data.analysis);
          if (data.note) {
            triggerToast("Parecer jurídico expedido via motor de contingência local (cota de IA excedida).", "info");
          } else {
            triggerToast("Auditoria jurídica finalizada com sucesso!", "success");
          }
        }
      })
      .catch(err => {
        console.error(err);
        triggerToast("Erro no parecer legal.", "error");
      })
      .finally(() => {
        setLegalAuditLoading(false);
      });
  };

  // Create client ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject || !newTicketDesc) {
      triggerToast("Preencha todos os campos do chamado.", "error");
      return;
    }
    if (!portalSession?.access_token) {
      triggerToast("Sessão expirada. Faça login novamente.", "error");
      return;
    }
    try {
      const response = await fetch("/api/create-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${portalSession.access_token}` },
        body: JSON.stringify({ subject: newTicketSubject, description: newTicketDesc, category: newTicketCat }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível abrir o chamado.");
      setTickets([data.ticket, ...tickets]);
      setNewTicketSubject("");
      setNewTicketDesc("");
      triggerToast("Chamado técnico aberto com sucesso!", "success");
    } catch (error: any) {
      triggerToast(error.message || "Não foi possível abrir o chamado.", "error");
    }
  };

  // Drag and drop lead stage update simulation
  const loadCrmLeads = async () => {
    if (!portalSession?.access_token) return;
    const response = await fetch("/api/admin/leads", {
      method: "POST", headers: { Authorization: `Bearer ${portalSession.access_token}` },
    });
    if (response.ok) {
      const list = (await response.json()).leads || [];
      setCrmLeads(list.map((l: any) => ({
        id: l.id, name: l.name, company: l.company, phone: l.phone, email: l.email,
        billValue: l.bill_value, stage: l.stage, assignedAgent: l.assigned_agent, createdAt: l.created_at,
      })));
    } else {
      triggerToast("Não foi possível carregar os leads.", "error");
    }
  };

  const handleAddLead = async () => {
    if (!newLeadName || !newLeadCompany) {
      triggerToast("Preencha ao menos nome e empresa do lead.", "error");
      return;
    }
    if (!portalSession?.access_token) return;
    try {
      const response = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${portalSession.access_token}` },
        body: JSON.stringify({
          action: "create",
          name: newLeadName, company: newLeadCompany, phone: newLeadPhone, email: newLeadEmail,
          billValue: newLeadBillValue ? Number(newLeadBillValue) : null, assignedAgent: newLeadAgent,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível criar o lead.");
      const l = data.lead;
      setCrmLeads(prev => [{ id: l.id, name: l.name, company: l.company, phone: l.phone, email: l.email, billValue: l.bill_value, stage: l.stage, assignedAgent: l.assigned_agent, createdAt: l.created_at }, ...prev]);
      setNewLeadName(""); setNewLeadCompany(""); setNewLeadPhone(""); setNewLeadEmail(""); setNewLeadBillValue(""); setNewLeadAgent("");
      triggerToast("Lead adicionado com sucesso!", "success");
    } catch (error: any) {
      triggerToast(error.message || "Não foi possível criar o lead.", "error");
    }
  };

  // Drag and drop lead stage update — agora grava de verdade no Supabase
  const handleLeadStageUpdate = async (leadId: string, nextStage: CRMLead["stage"]) => {
    const lead = crmLeads.find(l => l.id === leadId);
    setCrmLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: nextStage } : l));
    if (lead) triggerToast(`Lead ${lead.company} movido para: ${nextStage}`, "success");
    if (!portalSession?.access_token) return;
    try {
      const response = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${portalSession.access_token}` },
        body: JSON.stringify({ action: "update", leadId, stage: nextStage }),
      });
      if (!response.ok) throw new Error();
    } catch {
      triggerToast("Não foi possível salvar a mudança de estágio no banco.", "error");
      await loadCrmLeads();
    }
  };

  const discountFactor = 1 - factoryDiscountPercent / 100;
  const commission = (selectedGenerator.vendaPrice * quantityVenda) * discountFactor * (locacaoCommissionPercent / 100);
  const totalWithCommission = ((selectedGenerator.vendaPrice * quantityVenda) * discountFactor) + commission;

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-[100] max-w-sm bg-white border border-slate-200 p-4 rounded-xl shadow-lg animate-fade-in flex items-start gap-3">
          <div className={`p-1.5 rounded-lg ${toast.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : toast.type === "error" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-cyan-50 text-cyan-600 border border-cyan-100"}`}>
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold font-display text-slate-900">Notificação do Sistema</h4>
            <p className="text-xs text-slate-500 mt-0.5">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        {/* Logo Banner */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">Ω</div>
          <div>
            <h1 className="font-bold text-white leading-tight font-display text-base">OCTA ENERGY</h1>
            <p className="text-[10px] text-slate-500 tracking-widest uppercase">AI Dimensioning</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase mb-2 px-2">Menu Principal</p>
          
          <div
            onClick={() => setActiveTab("dimensionador")}
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors flex items-center gap-2.5 ${
              activeTab === "dimensionador" 
                ? "bg-slate-800 text-white font-semibold" 
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Dimensionamento AI</span>
          </div>

          <div
            onClick={() => setActiveTab("financeiro")}
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors flex items-center gap-2.5 ${
              activeTab === "financeiro" 
                ? "bg-slate-800 text-white font-semibold" 
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Simulação Financeira</span>
          </div>

          <div
            onClick={() => setActiveTab("proposta")}
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors flex items-center gap-2.5 ${
              activeTab === "proposta" 
                ? "bg-slate-800 text-white font-semibold" 
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Proposta & Contrato</span>
          </div>

          <div
            onClick={() => setActiveTab("catalogo")}
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors flex items-center gap-2.5 ${
              activeTab === "catalogo" 
                ? "bg-slate-800 text-white font-semibold" 
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Catálogo & Preços</span>
          </div>

          <p className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase mt-4 mb-2 px-2">Portais Compartilhados</p>

          <div
            onClick={() => openPortal("cliente")}
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors flex items-center gap-2.5 ${
              activeTab === "cliente" 
                ? "bg-slate-800 text-white font-semibold" 
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Portal do Cliente</span>
          </div>

          {portalSession && (
            <div
              onClick={handlePortalLogout}
              className="px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors flex items-center gap-2.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 mt-2 border-t border-slate-800 pt-4"
            >
              <X className="w-4 h-4" />
              <span>Sair do portal</span>
            </div>
          )}
          {portalSession && portalRole === "admin" && (
            <div
              onClick={() => setActiveTab("admin-tickets")}
              className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors flex items-center gap-2.5 ${
                activeTab === "admin-tickets" 
                  ? "bg-slate-800 text-white font-semibold" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Painel Admin: Chamados</span>
            </div>
          )}
          {portalSession && portalRole === "admin" && (
            <div
              onClick={() => setActiveTab("admin-proposals")}
              className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors flex items-center gap-2.5 ${
                activeTab === "admin-proposals" 
                  ? "bg-slate-800 text-white font-semibold" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Painel Admin: Propostas</span>
            </div>
          )}
          {portalSession && portalRole === "admin" && (
            <div
              onClick={() => setActiveTab("crm")}
              className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors flex items-center gap-2.5 ${
                activeTab === "crm" 
                  ? "bg-slate-800 text-white font-semibold" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Painel Admin: CRM/Leads</span>
            </div>
          )}
          {portalSession && portalRole === "admin" && (
            <div
              onClick={() => setActiveTab("investidor")}
              className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors flex items-center gap-2.5 ${
                activeTab === "investidor" 
                  ? "bg-slate-800 text-white font-semibold" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Painel Admin: Investidor/BNDES</span>
            </div>
          )}
        </nav>
        
        {/* System Health */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
            <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1">System Health</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-xs text-slate-300">AI Agents Active (9/9)</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Simulação: <span className="text-slate-500">{electricityBill.clientName}</span>
            </h2>
            <button
              onClick={() => {
                const targetOption = selectedOption === "venda" ? "locacao" : "venda";
                setSelectedOption(targetOption);
                setActiveTab("financeiro");
                triggerToast(`Direcionado para Simulação Financeira: ${targetOption === "venda" ? "Venda Direta / BNDES" : "Locação Estruturada"}`, "success");
              }}
              title="Clique para alternar o Modelo Comercial / Linha de Crédito"
              className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 border shadow-xs ${
                selectedOption === "venda" 
                  ? "bg-blue-600 text-white border-blue-700 hover:bg-blue-700 hover:shadow-md" 
                  : "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 hover:shadow-md"
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>{selectedOption === "venda" ? "BNDES CREDIT LINE" : "LOCAÇÃO ESTRUTURADA"}</span>
            </button>
            {/* Live Brasília Clock */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600">
              <Clock className="w-3.5 h-3.5 text-emerald-600 animate-pulse shrink-0" />
              <span>Brasília: {currentTime}</span>
            </div>
          </div>

          {/* Controls & Role Selector */}
          <div className="flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <span className="text-[10px] font-mono text-slate-400 px-2 uppercase font-semibold">Perfil Ativo:</span>
              {(["admin", "investor", "client", "agent"] as const).map(profile => (
                <button
                  key={profile}
                  onClick={() => {
                    setCurrentProfile(profile);
                    triggerToast(`Alterado para visão de: ${profile.toUpperCase()}`, "info");
                    if (profile === "investor") setActiveTab("investidor");
                    else if (profile === "client") setActiveTab("cliente");
                    else if (profile === "agent") setActiveTab("crm");
                  }}
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-all capitalize ${
                    currentProfile === profile 
                      ? "bg-white text-slate-900 shadow-xs font-semibold" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {profile === "admin" ? "Admin" : profile === "investor" ? "Investidor" : profile === "client" ? "Cliente" : "Vendedor"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="header-file-upload-input" className="px-4 py-2 bg-slate-100 border border-slate-200 rounded text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer">
                Upload Conta de Luz
              </label>
              <input 
                id="header-file-upload-input"
                type="file" 
                className="hidden" 
                accept="image/*,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }} 
              />
              <button 
                onClick={() => requestProposalEmail(generatedProposal ? "print" : "generate")}
                className="px-4 py-2 bg-emerald-600 text-white rounded text-sm font-semibold shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>{generatedProposal ? "Ver/Imprimir PDF" : "Gerar Proposta PDF"}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area Container */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50 flex flex-col gap-6">
          
          {/* TAB 1: DIMENSIONADOR */}
          {activeTab === "dimensionador" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display text-slate-900">Dimensionamento Inteligente de Ativos</h2>
                    <p className="text-xs text-slate-500">Insira a conta de energia via scanner inteligente ou simule dados manuais</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* OCR Drag & Drop panel */}
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                      dragOver 
                        ? "border-emerald-500 bg-emerald-50/50 shadow-sm" 
                        : "border-slate-200 hover:border-emerald-500 hover:bg-slate-50/50 bg-white"
                    }`}
                  >
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      {ocrLoading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Arrastar conta de energia (PDF ou Foto)</p>
                      <p className="text-xs text-slate-500 mt-1">Leitura automatizada via IA (OCR inteligente)</p>
                    </div>
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-4 py-2 rounded-xl border border-slate-200 transition-all font-semibold shadow-xs">
                      Procurar Arquivo
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }} 
                      />
                    </label>
                    {uploadedFileName && (
                      <span className="text-[11px] font-mono text-cyan-700 bg-cyan-50 border border-cyan-100 px-2 py-1 rounded">
                        ✓ {uploadedFileName}
                      </span>
                    )}
                  </div>

                  {/* Manual numerical entry form */}
                  <form onSubmit={handleManualSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-xs">
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Simulação de Entrada Alternativa</span>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-600 font-medium">Nome do Cliente / Razão Social</label>
                      <input 
                        type="text" 
                        value={manualClientName}
                        onChange={(e) => {
                          setManualClientName(e.target.value);
                          setBndesRazaoSocial(e.target.value);
                          setElectricityBill(prev => ({
                            ...prev,
                            clientName: e.target.value
                          }));
                        }}
                        placeholder="Ex: Empresa Ltda"
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-600 font-medium">INSIRA CNPJ</label>
                        <input 
                          type="text" 
                          value={manualCnpj}
                          onChange={(e) => {
                            setManualCnpj(e.target.value);
                            setBndesCnpj(e.target.value);
                          }}
                          placeholder="Ex: 00.000.000/0001-00"
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-600 font-medium">INSC. ESTADUAL</label>
                        <input 
                          type="text" 
                          value={manualInscEstadual}
                          onChange={(e) => setManualInscEstadual(e.target.value)}
                          placeholder="Ex: 00.000.000-0"
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-600 font-medium">Valor Mensal (R$)</label>
                        <input 
                          type="number" 
                          value={manualValor}
                          onChange={(e) => handleValorChange(e.target.value)}
                          placeholder="Ex: 200000"
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-600 font-medium">Consumo (kWh/mês)</label>
                        <input 
                          type="number" 
                          value={manualConsumo}
                          onChange={(e) => handleConsumoChange(e.target.value)}
                          placeholder="Ex: 266667"
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <button 
                        type="button"
                        onClick={clearAllData}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-center gap-1.5"
                        title="Limpar todos os campos do formulário"
                      >
                        <Trash2 className="w-4 h-4 text-slate-500" />
                        Limpar Dados
                      </button>
                      <button 
                        type="submit" 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md"
                      >
                        Calcular Dimensionamento
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Dimensioning output visualization */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recommended equipment card */}
                <div className="lg:col-span-2 bg-gradient-to-b from-emerald-50/50 to-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between gap-6 shadow-sm">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-mono font-bold tracking-wider uppercase">
                        Equipamento Dimensionado por Engenharia AI
                      </span>
                      <span className="text-xs font-mono text-slate-400">Eficiência Térmica Assegurada</span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-4">
                      <h3 className="text-4xl font-extrabold font-display text-slate-950">{selectedGenerator.capacityKva} KVA</h3>
                      <span className="text-xs text-slate-500">Cinético Magnético</span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Este gerador fornece potência contínua sem queima de combustíveis, aproveitando o torque induzido eletromagneticamente por magnetos de alta densidade de neodímio.
                    </p>

                    {/* Tech details grid */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[9px] text-slate-400 font-mono font-bold uppercase block">Potência Total</span>
                        <span className="text-sm font-semibold text-slate-900 mt-1 block">{(selectedGenerator.powerKw * (selectedOption === "venda" ? quantityVenda : quantityLocacao))} kW</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[9px] text-slate-400 font-mono font-bold uppercase block">Produção Total</span>
                        <span className="text-sm font-semibold text-emerald-600 mt-1 block">{(selectedGenerator.generationKwh * (selectedOption === "venda" ? quantityVenda : quantityLocacao)).toLocaleString("pt-BR")} kWh</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[9px] text-slate-400 font-mono font-bold uppercase block">Fator Utilização</span>
                        <span className="text-sm font-semibold text-blue-600 mt-1 block">90%</span>
                      </div>
                    </div>
                  </div>

                  {/* Manual KVA picker override */}
                  <div className="border-t border-slate-100 pt-4">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block mb-2">Ajuste Manual do Modelo (Selecione um Gerador)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {GENERATORS_CATALOG.map(gen => (
                        <button
                          key={gen.capacityKva}
                          onClick={() => setSelectedGenerator(gen)}
                          className={`text-[10px] px-2.5 py-1.5 rounded-lg transition-all font-mono font-semibold ${
                            selectedGenerator.capacityKva === gen.capacityKva
                              ? "bg-emerald-600 text-white font-bold shadow-xs"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {gen.capacityKva} KVA
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sizing indicators & Eco Impact */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between gap-6 shadow-sm">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Métricas de Cobertura e Carga</h4>
                    
                    <div className="flex flex-col gap-4">
                      {/* Meter bar */}
                      {(() => {
                        const currentQuantity = selectedOption === "venda" ? quantityVenda : quantityLocacao;
                        const totalGenKwh = selectedGenerator.generationKwh * currentQuantity;
                        const coveragePct = Math.min(100, Math.round((totalGenKwh / electricityBill.consumoKwh) * 100));
                        const totalKva = selectedGenerator.capacityKva * currentQuantity;
                        
                        return (
                          <>
                            <div>
                              <div className="flex justify-between text-xs text-slate-600 font-mono mb-1.5">
                                <span>Cobertura da Carga:</span>
                                <span className="text-emerald-600 font-bold">
                                  {coveragePct}%
                                </span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                                  style={{ width: `${coveragePct}%` }}
                                ></div>
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono mt-1 block">
                                Produz {totalGenKwh.toLocaleString("pt-BR")} de {electricityBill.consumoKwh.toLocaleString("pt-BR")} kWh/mês faturados.
                              </span>
                            </div>

                            <div className="h-px bg-slate-100"></div>

                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500">Tarifa de Referência:</span>
                              <span className="text-slate-800 font-mono font-medium">R$ {electricityBill.tarifa}/kWh</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500">Custo Atual Estimado:</span>
                              <span className="text-slate-800 font-mono font-semibold">R$ {electricityBill.valorConta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Eco Impact stats */}
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                    <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-widest font-mono block mb-2">Pegada de Carbono Evitada</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {(() => {
                        const currentQuantity = selectedOption === "venda" ? quantityVenda : quantityLocacao;
                        const totalKva = selectedGenerator.capacityKva * currentQuantity;
                        return (
                          <>
                            <div>
                              <span className="text-slate-500 text-[10px]">Árvores Salvas / Ano</span>
                              <p className="text-slate-900 font-bold mt-0.5">
                                {Math.round(totalKva * 3.4).toLocaleString("pt-BR")}
                              </p>
                            </div>
                            <div>
                              <span className="text-slate-500 text-[10px]">Tons CO2 Neutralizado</span>
                              <p className="text-slate-900 font-bold mt-0.5">
                                {Math.round(totalKva * 0.85).toLocaleString("pt-BR")} t
                              </p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: VIABILIDADE */}
          {activeTab === "financeiro" && financeAnalysis && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Select Business Model Header */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Modelo Comercial de Ativo Energético</h2>
                  <p className="text-xs text-slate-500">Escolha como operacionalizar ou vender o gerador cinético magnético</p>
                </div>
                
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setSelectedOption("locacao")}
                    className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                      selectedOption === "locacao" 
                        ? "bg-white text-slate-900 shadow-xs font-bold" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Locação Estruturada (Octa Reference)
                  </button>
                  <button
                    onClick={() => setSelectedOption("venda")}
                    className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                      selectedOption === "venda" 
                        ? "bg-white text-slate-900 shadow-xs font-bold" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Venda Direta / BNDES Investidor
                  </button>
                </div>
              </div>

              {/* Finance specs & metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Financial simulation controls */}
                <div className="lg:col-span-1 bg-white border border-slate-200 p-6 rounded-2xl flex flex-col gap-6 shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Parâmetros de Investimento</h3>
                    <p className="text-xs text-slate-500">Ajuste os valores para simulações financeiras personalizadas</p>
                  </div>

                  <div className="h-px bg-slate-100"></div>

                  {/* Campo de Quantidade de Geradores (Venda e Locação) */}
                  <div className="flex flex-col gap-2 bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-blue-900 font-bold flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        {selectedOption === "venda" ? "Quantidade para Venda:" : "Quantidade para Locação:"}
                      </span>
                      <span className="text-blue-900 font-bold font-mono">
                        {selectedOption === "venda" ? quantityVenda : quantityLocacao} {selectedOption === "venda" ? (quantityVenda === 1 ? "unidade" : "unidades") : (quantityLocacao === 1 ? "unidade" : "unidades")}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedOption === "venda") {
                            setQuantityVenda(prev => Math.max(1, prev - 1));
                          } else {
                            setQuantityLocacao(prev => Math.max(1, prev - 1));
                          }
                        }}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors font-bold text-lg select-none cursor-pointer"
                      >
                        -
                      </button>
                      
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={selectedOption === "venda" ? quantityVenda : quantityLocacao}
                        onChange={(e) => {
                          const val = Math.max(1, Math.min(100, Number(e.target.value) || 1));
                          if (selectedOption === "venda") {
                            setQuantityVenda(val);
                          } else {
                            setQuantityLocacao(val);
                          }
                        }}
                        className="flex-1 h-8 bg-white border border-slate-200 rounded-lg text-center text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                      />
                      
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedOption === "venda") {
                            setQuantityVenda(prev => Math.min(100, prev + 1));
                          } else {
                            setQuantityLocacao(prev => Math.min(100, prev + 1));
                          }
                        }}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors font-bold text-lg select-none cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    
                    <p className="text-[10px] text-slate-400 font-mono">
                      {selectedOption === "venda" 
                        ? "Define o número de geradores adquiridos na venda direta." 
                        : "Define o número de geradores instalados no modelo de locação."}
                    </p>
                  </div>

                  {/* Desconto da Fábrica Field */}
                  <div className="flex flex-col gap-2 bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Desconto da Fábrica:
                      </span>
                      <span className="text-emerald-900 font-bold">{factoryDiscountPercent}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={factoryDiscountPercent}
                      onChange={(e) => setFactoryDiscountPercent(Number(e.target.value))}
                      className="accent-emerald-600 w-full cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Sem desconto</span>
                      <span>Máx: 50%</span>
                    </div>
                    {factoryDiscountPercent > 0 && (
                      <div className="text-[11px] text-emerald-700 font-medium font-mono mt-1 flex justify-between items-center border-t border-emerald-100 pt-1">
                        <span>Valor do Desconto:</span>
                        <span>
                          R$ {(((selectedOption === "venda" ? selectedGenerator.vendaPrice : selectedGenerator.locacaoRefPrice) * (selectedOption === "venda" ? quantityVenda : quantityLocacao)) * factoryDiscountPercent / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Comissão de Vendas Field */}
                  <div className="flex flex-col gap-2 bg-slate-50/70 border border-slate-200 p-4 rounded-xl">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-800 font-bold flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        Comissão de Vendas:
                      </span>
                      <span className="text-slate-900 font-bold">{locacaoCommissionPercent}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={locacaoCommissionPercent}
                      onChange={(e) => setLocacaoCommissionPercent(Number(e.target.value))}
                      className="accent-slate-700 w-full cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Sem comissão</span>
                      <span>Máx: 50%</span>
                    </div>
                    {locacaoCommissionPercent > 0 && (
                      <div className="text-[11px] text-slate-700 font-medium font-mono mt-1 flex justify-between items-center border-t border-slate-200 pt-1">
                        <span>Valor da Comissão:</span>
                        <span>
                          R$ {(financeAnalysis?.commission || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-slate-100"></div>

                  {selectedOption === "venda" ? (
                    /* BNDES / Venda params */
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-500">Aporte de Entrada:</span>
                          <span className="text-slate-900 font-semibold">R$ {bndesDownPayment.toLocaleString("pt-BR")}</span>
                        </div>
                        <input 
                          type="range"
                          min={totalWithCommission * 0.1}
                          max={totalWithCommission * 0.8}
                          step={10000}
                          value={bndesDownPayment}
                          onChange={(e) => {
                            setBndesDownPayment(Number(e.target.value));
                            setVendaSplit50(false);
                          }}
                          className="accent-emerald-600 w-full cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>Mínimo 10% do valor do ativo + comissão</span>
                          <span>Máximo 80%</span>
                        </div>
                      </div>

                      {/* Regra de Fabricação 50/50 Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const newVendaSplit50 = !vendaSplit50;
                          setVendaSplit50(newVendaSplit50);
                          if (newVendaSplit50) {
                            setBndesDownPayment(totalWithCommission * 0.5);
                            triggerToast("Condição de Pagamento 50/50 Ativada! (50% de entrada e 50% na entrega e posto em marcha)", "success");
                          } else {
                            triggerToast("Condição de Pagamento 50/50 desativada.", "info");
                          }
                        }}
                        className={`w-full p-3 rounded-xl border transition-all text-left flex items-start gap-3 cursor-pointer ${
                          vendaSplit50
                            ? "bg-emerald-50/80 border-emerald-300 text-emerald-900 shadow-xs animate-pulse"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          vendaSplit50 ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 text-transparent"
                        }`}>
                          <svg className="w-3 h-3 fill-current stroke-current" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="flex flex-col w-full">
                          <span className="text-xs font-semibold">Regra de Fabricação: Venda 50/50</span>
                          <span className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                            50% de Aporte de Entrada (Sinal) + 50% na Entrega e Posto em Marcha
                          </span>
                          {vendaSplit50 && (
                            <div className="mt-2 pt-2 border-t border-emerald-200/50 grid grid-cols-2 gap-2 text-[10px] font-mono text-emerald-800">
                              <div>
                                <strong className="block text-emerald-700">Sinal de Entrada (50%):</strong>
                                R$ {bndesDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <div>
                                <strong className="block text-emerald-700">Na Entrega (50%):</strong>
                                R$ {bndesDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                            </div>
                          )}
                        </div>
                      </button>

                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-500">Taxa de Juros Anual (BNDES):</span>
                          <span className="text-slate-900 font-semibold">{(bndesAnnualRate * 100).toFixed(1)}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0.05"
                          max="0.18"
                          step="0.005"
                          value={bndesAnnualRate}
                          onChange={(e) => setBndesAnnualRate(Number(e.target.value))}
                          className="accent-emerald-600 w-full cursor-pointer"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-slate-500 font-medium">Prazo Total (Meses)</label>
                          <input 
                            type="number"
                            value={bndesTermMonths}
                            onChange={(e) => setBndesTermMonths(Number(e.target.value))}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-slate-500 font-medium">Carência (Meses)</label>
                          <input 
                            type="number"
                            value={bndesGraceMonths}
                            onChange={(e) => setBndesGraceMonths(Number(e.target.value))}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Locação Estruturada parameters */
                    <div className="flex flex-col gap-4 text-xs">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-500 font-medium">Aluguel (% da conta base):</span>
                          <span className="text-slate-950 font-bold">{locacaoRentPercent}%</span>
                        </div>
                        <input 
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          value={locacaoRentPercent}
                          onChange={(e) => setLocacaoRentPercent(Number(e.target.value))}
                          className="accent-emerald-600 w-full cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-400 font-mono">Aluguel mensal após a carência</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-500 font-medium">Meses de Bônus:</span>
                          <span className="text-slate-950 font-bold">{locacaoBonusMonths} Meses</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="12"
                          step="1"
                          value={locacaoBonusMonths}
                          onChange={(e) => setLocacaoBonusMonths(Number(e.target.value))}
                          className="accent-emerald-600 w-full cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-400 font-mono">Meses bônus somados à carência</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-500 font-medium font-bold">Prazo do Contrato:</span>
                          <span className="text-slate-950 font-bold">{locacaoContractMonths} Meses</span>
                        </div>
                        <input 
                          type="range"
                          min="12"
                          max="120"
                          step="6"
                          value={locacaoContractMonths}
                          onChange={(e) => setLocacaoContractMonths(Number(e.target.value))}
                          className="accent-emerald-600 w-full cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-400 font-mono">Duração do faturamento de locação</span>
                      </div>

                      <div className="flex flex-col gap-2 bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl">
                        <div className="flex justify-between font-mono text-xs">
                          <span className="text-emerald-800 font-bold">Regra de Fabricação:</span>
                          <span className="text-emerald-950 font-bold">100% Sinal</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          O custo de fabricação é integralmente lastreado pelo sinal no pedido.
                        </p>
                        <div className="text-xs font-mono font-bold text-slate-800 border-t border-emerald-100 pt-1.5 mt-1 flex justify-between">
                          <span>Total do Sinal (100%):</span>
                          <span>R$ {(financeAnalysis?.investment || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action to match Grace Period with Payback */}
                  {financeAnalysis && (
                    <div className="mt-2 pt-4 border-t border-slate-100 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const payback = Math.round(financeAnalysis.paybackSimple);
                          if (selectedOption === "venda") {
                            setBndesGraceMonths(payback);
                            triggerToast(`Carência do BNDES ajustada para ${payback} meses (igual ao Payback).`, "success");
                          } else {
                            // In Locação, gargantuaGracePeriod = Math.ceil(paybackSimple + bonusMonths).
                            // Set locacaoBonusMonths to 0 so gargantuaGracePeriod is exactly equal to payback (Math.ceil(paybackSimple)).
                            setLocacaoBonusMonths(0);
                            triggerToast(`Meses de bônus definidos como 0 para igualar a Carência ao Payback (${Math.ceil(financeAnalysis.paybackSimple)} meses).`, "success");
                          }
                        }}
                        className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 hover:text-amber-900 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-center gap-1.5"
                        title="Ajustar automaticamente a carência para coincidir com o tempo de payback estimado"
                      >
                        <TrendingUp className="w-4 h-4 text-amber-600" />
                        Carência = Payback ({selectedOption === "venda" ? Math.round(financeAnalysis.paybackSimple) : Math.ceil(financeAnalysis.paybackSimple)} Meses)
                      </button>
                      <p className="text-[10px] text-slate-400 text-center leading-normal">
                        Sincroniza o período de carência com o tempo de payback calculado.
                      </p>
                    </div>
                  )}
                </div>

                {/* Key indicators and metrics outputs */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Indicators Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    
                    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs relative overflow-hidden">
                      {factoryDiscountPercent > 0 && (
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl">
                          -{factoryDiscountPercent}% DESC
                        </div>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Investimento Total</span>
                      <span className="text-lg font-bold text-slate-900 mt-1 block">R$ {financeAnalysis.investment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      <span className="text-[9px] text-slate-500 mt-1 block leading-tight">
                        {selectedOption === "venda" ? "Preço de Venda + Comissão" : "Custo de Locação + Comissão"}
                      </span>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Payback Simples</span>
                      <span className="text-lg font-bold text-emerald-600 mt-1 block">{financeAnalysis.paybackSimple} Meses</span>
                      <span className="text-[9px] text-slate-500 mt-1 block leading-tight">Retorno do capital investido</span>
                    </div>

                    {selectedOption !== "venda" && (
                      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Carência Assegurada</span>
                        <span className="text-lg font-bold text-blue-600 mt-1 block">{financeAnalysis.gargantuaGracePeriod} Meses</span>
                        <span className="text-[9px] text-slate-500 mt-1 block leading-tight">Inclui +2 meses de bônus comercial</span>
                      </div>
                    )}

                    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">TIR Estimada (IRR)</span>
                      <span className="text-lg font-bold text-indigo-600 mt-1 block">{(financeAnalysis.tir * 100).toFixed(1)}% a.a.</span>
                      <span className="text-[9px] text-slate-500 mt-1 block leading-tight">Taxa Interna de Retorno</span>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">VPL Projetado (NPV)</span>
                      <span className="text-lg font-bold text-emerald-600 mt-1 block">R$ {financeAnalysis.vpl.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</span>
                      <span className="text-[9px] text-slate-500 mt-1 block leading-tight">Fluxo Descontado a 12% a.a.</span>
                    </div>

                  </div>

                  {/* Financial projections details */}
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Projeção Consolidada (Contrato de 60 Meses)</h4>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="text-xs text-slate-500">Receita Bruta Acumulada</span>
                        <p className="text-xl font-extrabold text-slate-900 mt-1">R$ {financeAnalysis.totalRevenue60Months.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Arrecadação de parcelas locatícias</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="text-xs text-slate-500">Lucro Bruto Projetado</span>
                        <p className="text-xl font-extrabold text-emerald-700 mt-1">R$ {financeAnalysis.totalProfit60Months.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Receita menos investimento de referência</span>
                      </div>
                    </div>

                    {/* Simple chart simulation */}
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold block mb-3">Evolução do Fluxo de Caixa do Projeto (Carência + 60 Meses de Contrato)</span>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex items-end justify-between h-36 gap-1.5 pt-6">
                      {(() => {
                        const grace = financeAnalysis.gargantuaGracePeriod;
                        const totalM = grace + 60;
                        const points = [];
                        for (let i = 0; i <= 12; i++) {
                          points.push(Math.round((totalM / 12) * i));
                        }
                        const uniquePoints = Array.from(new Set(points.map(p => Math.max(1, p)))).sort((a, b) => a - b);
                        
                        return uniquePoints.map((m) => {
                          const isGrace = m <= grace;
                          const heightPercent = isGrace ? 12 : 85;
                          return (
                            <div key={m} className="flex flex-col items-center flex-1 group relative">
                              {/* Hover tooltip */}
                              <div className="absolute bottom-full mb-2 bg-slate-900 border border-slate-800 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-150 z-20 whitespace-nowrap">
                                Mês {m}: {isGrace ? "Carência" : `Contrato (R$ ${financeAnalysis.clientPayment.toLocaleString("pt-BR")})`}
                              </div>
                              <div 
                                className={`w-full rounded-t-md transition-all ${isGrace ? "bg-amber-300" : "bg-emerald-500"}`} 
                                style={{ height: `${heightPercent}px` }}
                              ></div>
                              <span className="text-[9px] font-mono text-slate-400 mt-2">M{m}</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                </div>

              </div>

              {/* BNDES Credit Portal - Ficha Cadastral, Condições & Documentos (Visible only when selectedOption is "venda") */}
              {false && selectedOption === "venda" && (
                <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col gap-8 animate-fade-in">
                  
                  {/* Portal Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/20">
                        <Building className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold tracking-wider font-mono uppercase text-blue-400">Canal de Parceria Homologado</span>
                          <span className="text-[9px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full uppercase">BNDES Finame</span>
                        </div>
                        <h3 className="text-xl font-bold font-display text-white mt-1">Portal de Crédito BNDES</h3>
                        <p className="text-xs text-slate-400">Preenchimento de Ficha Cadastral, Condições de Aprovação e Envio de Documentos.</p>
                      </div>
                    </div>
                    
                    {/* Overall Status Badge */}
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Status da Análise</span>
                      {bndesAnnualRevenue >= financeAnalysis.investment * 2 && (2026 - bndesFoundedYear) >= 2 && bndesDocuments.length >= 2 ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold rounded-lg uppercase mt-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Crédito Pré-Aprovado</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold rounded-lg uppercase mt-1">
                          <AlertTriangle className="w-4 h-4 animate-pulse" />
                          <span>Aguardando Documentação / Revisão</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Portal Columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Col 1: Ficha Cadastral Form (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col gap-5">
                      <div>
                        <h4 className="text-xs font-bold font-mono uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                          Ficha Cadastral da Empresa
                        </h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Razão Social</label>
                            <input
                              type="text"
                              value={bndesRazaoSocial}
                              onChange={(e) => setBndesRazaoSocial(e.target.value)}
                              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-500"
                              placeholder="Ex: Minha Empresa Ltda"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CNPJ</label>
                              <input
                                type="text"
                                value={bndesCnpj}
                                onChange={(e) => setBndesCnpj(e.target.value)}
                                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-500"
                                placeholder="12.345.678/0001-99"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ano de Fundação</label>
                              <input
                                type="number"
                                value={bndesFoundedYear}
                                onChange={(e) => setBndesFoundedYear(Number(e.target.value))}
                                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500 transition-all"
                                min="1950"
                                max="2026"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Representante Legal</label>
                            <input
                              type="text"
                              value={bndesRepresentative}
                              onChange={(e) => setBndesRepresentative(e.target.value)}
                              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-blue-500 transition-all"
                              placeholder="Nome do Sócio Outorgado"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faturamento Anual Bruto (R$)</label>
                              <span className="text-[10px] text-blue-400 font-mono font-bold">R$ {bndesAnnualRevenue.toLocaleString("pt-BR")}</span>
                            </div>
                            <input
                              type="number"
                              value={bndesAnnualRevenue}
                              onChange={(e) => setBndesAnnualRevenue(Number(e.target.value))}
                              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500 transition-all"
                              placeholder="Ex: 12000000"
                            />
                            <p className="text-[9px] text-slate-500 mt-1 leading-normal font-mono">
                              * Utilizado para categorizar o porte da empresa no regulamento BNDES Finame e testar a margem mínima.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Col 2: Condições de Aprovação (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-5 border-t lg:border-t-0 lg:border-x border-slate-800 lg:px-6 pt-6 lg:pt-0">
                      <div>
                        <h4 className="text-xs font-bold font-mono uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Condições de Aprovação & Compliance
                        </h4>
                        
                        <div className="space-y-4">
                          
                          {/* Indicator 1: Margem de Faturamento */}
                          <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl flex items-start gap-3">
                            <div className="shrink-0 mt-0.5">
                              {bndesAnnualRevenue >= financeAnalysis.investment * 2 ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200 uppercase tracking-wide">Margem de Faturamento</p>
                              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-mono">
                                {bndesAnnualRevenue >= financeAnalysis.investment * 2 ? (
                                  `Faturamento de R$ ${bndesAnnualRevenue.toLocaleString("pt-BR")} é saudável (${(bndesAnnualRevenue / financeAnalysis.investment).toFixed(1)}x o gerador).`
                                ) : (
                                  `Margem de R$ ${bndesAnnualRevenue.toLocaleString("pt-BR")} é baixa (${(bndesAnnualRevenue / financeAnalysis.investment).toFixed(1)}x). Recomendável aporte maior de entrada.`
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Indicator 2: Tempo de Atividade */}
                          <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl flex items-start gap-3">
                            <div className="shrink-0 mt-0.5">
                              {(2026 - bndesFoundedYear) >= 2 ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200 uppercase tracking-wide">Tempo de Atividade</p>
                              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-mono">
                                {(2026 - bndesFoundedYear) >= 2 ? (
                                  `Empresa madura com ${2026 - bndesFoundedYear} anos de existência (mínimo regulamentar de 2 anos atingido).`
                                ) : (
                                  `Menos de 2 anos (${2026 - bndesFoundedYear} ano(s)). Requer garantia real acessória dos sócios controladores.`
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Indicator 3: Certidões e Documentos */}
                          <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl flex items-start gap-3">
                            <div className="shrink-0 mt-0.5">
                              {bndesDocuments.length >= 2 ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200 uppercase tracking-wide">Certidões Regulatórias</p>
                              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-mono">
                                {bndesDocuments.length >= 2 ? (
                                  `Balanço e atos constitutivos homologados pelo compliance AI OCTA.`
                                ) : (
                                  `Pendente de documentos essenciais (balanço e atos constitutivos).`
                                )}
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Col 3: Envio de Documentos (3 cols) */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                      <div>
                        <h4 className="text-xs font-bold font-mono uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                          Anexar Documentação
                        </h4>
                        
                        {/* Interactive File Dropzone */}
                        <label className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-blue-500 bg-slate-800/20 hover:bg-slate-800/40 rounded-2xl p-6 text-center cursor-pointer transition-all">
                          <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors mb-2" />
                          <span className="text-xs font-bold text-slate-300">Escolher Arquivo</span>
                          <span className="text-[9px] text-slate-500 font-mono mt-1">PDF, JPG ou PNG de até 15MB</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="application/pdf,image/*"
                            onChange={handleBndesUpload}
                            multiple
                          />
                        </label>
                      </div>

                      {/* Attached documents list */}
                      {bndesDocuments.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold">
                            <span>Documentos ({bndesDocuments.length})</span>
                            <span className="text-blue-400 font-bold">Verificados via AI</span>
                          </div>
                          
                          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                            {bndesDocuments.map((doc) => (
                              <div key={doc.id} className="bg-slate-800/50 border border-slate-800/80 p-2.5 rounded-xl flex items-center justify-between gap-2 text-xs font-mono">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <div className="truncate">
                                    <p className="text-slate-200 truncate max-w-[120px] font-medium" title={doc.name}>{doc.name}</p>
                                    <span className="text-[9px] text-slate-500 block">{doc.size}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {doc.status === "Aprovado" ? (
                                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">CND OK</span>
                                  ) : (
                                    <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-bold uppercase shrink-0 animate-pulse">Lendo...</span>
                                  )}
                                  <button
                                    onClick={() => deleteBndesDoc(doc.id)}
                                    className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer p-0.5"
                                    title="Remover documento"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 3: PROPOSTA & CONTRATO */}
          {activeTab === "proposta" && financeAnalysis && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col gap-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display text-slate-900">Módulo de Propostas Automáticas + PDF Inteligente</h2>
                    <p className="text-xs text-slate-500">Gere propostas técnicas, comerciais e valide as minutas com inteligência artificial</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Action controls */}
                  <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Proposta Comercial & Memorial Técnico</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        A IA irá utilizar todas as informações do dimensionamento do gerador cinético de <strong>{selectedGenerator.capacityKva} KVA</strong> e dados do cliente para formular o escopo e o memorial descritivo completo.
                      </p>
                      <button
                        onClick={() => requestProposalEmail("generate")}
                        disabled={proposalLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        {proposalLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Redigindo Proposta...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Redigir Proposta Comercial via IA
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Legal AI - Auditoria Contratual</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        O agente de IA jurídica analisa cláusulas de carência pós-payback (+2 meses de bônus), multa rescisória (devolução de 30% antes de 30 meses), LGPD e responsabilidades civis de engenharia.
                      </p>
                      <button
                        onClick={handleLegalAudit}
                        disabled={legalAuditLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        {legalAuditLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Auditando Minuta...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" /> Auditar Minuta Contratual
                          </>
                        )}
                      </button>
                    </div>

                    {(selectedOption === "locacao" || (selectedOption === "venda" && vendaSplit50)) && (
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-2 text-slate-900">
                          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                          <h4 className="text-sm font-semibold">Aceite da Proposta: Regra de Fabricação</h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                          O custo estrutural de fabricação e montagem do equipamento é lastreado pelo fluxo de caixa inicial acordado (Aporte de Mobilização de Ativos):
                        </p>
                        <div className="text-[10.5px] font-mono text-slate-800 space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                          {selectedOption === "venda" ? (
                            <>
                              <div>
                                <span className="font-bold text-emerald-700 block mb-0.5">1. Sinal de Entrada / Mobilização (50%):</span>
                                R$ {bndesDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} no ato do pedido.
                              </div>
                              <div>
                                <span className="font-bold text-blue-700 block mb-0.5">2. Saldo na Entrega e Posto em Marcha (50%):</span>
                                R$ {bndesDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mediante a entrega física e inicialização do gerador.
                              </div>
                            </>
                          ) : (
                            <div>
                              <span className="font-bold text-emerald-700 block mb-0.5">1. Sinal de Fabricação ({locacaoInstallmentPercent}%):</span>
                              R$ {((financeAnalysis?.investment || 0) * (locacaoInstallmentPercent / 100)).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} no ato do pedido.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Output / Document Preview */}
                  <div className="lg:col-span-2 bg-slate-100/85 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between h-[850px] shadow-md">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wider">Papel Timbrado & Moldura Executiva</span>
                        <div className="flex bg-slate-200/80 rounded-lg p-1 border border-slate-300">
                          <button
                            onClick={() => setProposalFontSize("sm")}
                            className={`px-2.5 py-1 text-[10px] rounded-md font-bold transition-all cursor-pointer ${
                              proposalFontSize === "sm" ? "bg-white text-slate-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Pequeno (12px)
                          </button>
                          <button
                            onClick={() => setProposalFontSize("base")}
                            className={`px-2.5 py-1 text-[10px] rounded-md font-bold transition-all cursor-pointer ${
                              proposalFontSize === "base" ? "bg-white text-slate-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Médio (14px)
                          </button>
                          <button
                            onClick={() => setProposalFontSize("lg")}
                            className={`px-2.5 py-1 text-[10px] rounded-md font-bold transition-all cursor-pointer ${
                              proposalFontSize === "lg" ? "bg-white text-slate-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Grande (16px)
                          </button>
                          <button
                            onClick={() => setProposalFontSize("xl")}
                            className={`px-2.5 py-1 text-[10px] rounded-md font-bold transition-all cursor-pointer ${
                              proposalFontSize === "xl" ? "bg-white text-slate-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Extra G. (18px)
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <button 
                          onClick={downloadProposalPDF}
                          disabled={!generatedProposal && !legalAuditReport}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-xs transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-2"
                          title="Download PDF"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Gerar PDF Oficial</span>
                        </button>

                        <button 
                          onClick={downloadDOCXProposal}
                          disabled={!generatedProposal && !legalAuditReport}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-xs transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-2"
                          title="Baixar em formato Word (.doc)"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Gerar Proposta Word (DOC)</span>
                        </button>

                        <button 
                          onClick={downloadCSVProposal}
                          disabled={!financeAnalysis}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-xs transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-2"
                          title="Exportar dados econômicos e dimensionamento para arquivo .csv"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                          <span>Exportar Dados (CSV)</span>
                        </button>

                        <button 
                          onClick={() => {
                            setIsRevised(true);
                            triggerToast("Proposta marcada como REVISADA. Iniciando exportação PDF...", "success");
                            downloadProposalPDF();
                          }}
                          disabled={!generatedProposal && !legalAuditReport}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-xs transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-2"
                          title="Marcar como revisada e abrir diálogo de PDF"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>Revisado e Salvar em PDF</span>
                        </button>
                        
                        {(generatedProposal || legalAuditReport) && (
                          <button 
                            onClick={() => {
                              if (isSigned) {
                                setIsSigned(false);
                                triggerToast("Assinatura digital removida.", "info");
                              } else {
                                setShowSignModal(true);
                              }
                            }}
                            className={`px-4 py-2 text-white font-bold rounded-xl text-xs transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-2 ${
                              isSigned 
                                ? "bg-amber-600 hover:bg-amber-700" 
                                : "bg-purple-600 hover:bg-purple-700"
                            }`}
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>{isSigned ? "Remover Assinatura" : "Assinar via ICP-Brasil"}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* A4 PAPER WITH ELEGANT FRAME (MOLDURA) */}
                    <div className="flex-1 overflow-y-auto my-4 pr-1 scrollbar-thin">
                      {generatedProposal || legalAuditReport ? (
                        <div className="max-w-4xl mx-auto">
                          <CorporateProposalLayout
                            generatedProposal={generatedProposal}
                            legalAuditReport={legalAuditReport}
                            selectedGenerator={selectedGenerator}
                            electricityBill={electricityBill}
                            financeAnalysis={financeAnalysis}
                            selectedOption={selectedOption}
                            vendaSplit50={vendaSplit50}
                            bndesDownPayment={bndesDownPayment}
                            locacaoInstallmentPercent={locacaoInstallmentPercent}
                            isRevised={isRevised}
                            isSigned={isSigned}
                            signerCpf={signerCpf}
                            signedAt={signedAt}
                            proposalFontSize={proposalFontSize}
                            quantityVenda={quantityVenda}
                            quantityLocacao={quantityLocacao}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center h-[500px] gap-4 bg-white border-4 border-dashed border-slate-200 rounded-2xl p-8">
                          <FileCode className="w-16 h-16 text-emerald-600/30 animate-pulse" />
                          <h4 className="text-sm font-bold text-slate-900">Nenhum Documento Gerado</h4>
                          <p className="text-xs text-slate-500 max-w-sm">
                            Utilize o painel lateral para redigir a Proposta Comercial Técnico-Financeira do gerador cinético de <strong>{selectedGenerator.capacityKva} KVA</strong> ou auditar a minuta legal.
                          </p>
                          <div className="flex gap-2.5 mt-2">
                            <button
                              onClick={() => requestProposalEmail("generate")}
                              className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                            >
                              Redigir Proposta Agora
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-[10px] text-emerald-850 flex items-center gap-2 font-medium">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Assinatura Eletrônica integrada habilitada via ICP-Brasil para fechamentos.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PORTAL DO INVESTIDOR */}
          {activeTab === "investidor" && financeAnalysis && portalRole === "admin" && (
            {/* TAB 4: PORTAL DO INVESTIDOR */}
          {activeTab === "investidor" && financeAnalysis && portalRole === "admin" && (
            <div className="flex flex-col gap-6 animate-fade-in">

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-1">Configurações da Plataforma</h3>
                <p className="text-xs text-slate-500 mb-4">Regras de negócio globais — afetam todas as novas propostas geradas no site.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { key: "bndes_annual_rate", label: "Taxa BNDES (ex: 0.085 = 8,5%)", value: bndesAnnualRate },
                    { key: "bndes_grace_months", label: "Carência BNDES (meses)", value: bndesGraceMonths },
                    { key: "factory_discount_percent", label: "Desconto fábrica padrão (%)", value: factoryDiscountPercent },
                    { key: "locacao_rent_percent", label: "% Locação padrão", value: locacaoRentPercent },
                    { key: "locacao_commission_percent", label: "Comissão padrão (%)", value: locacaoCommissionPercent },
                    { key: "locacao_installment_percent", label: "% Sinal padrão", value: locacaoInstallmentPercent },
                    { key: "bndes_min_revenue_multiplier", label: "Enquadramento: faturamento mín. (x investimento)", value: bndesMinRevenueMultiplier },
                    { key: "bndes_min_years_founded", label: "Enquadramento: anos mín. de fundação", value: bndesMinYearsFounded },
                    { key: "bndes_min_documents", label: "Enquadramento: documentos mín.", value: bndesMinDocuments },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-[10px] text-slate-500 font-semibold block mb-1">{field.label}</label>
                      <input
                        type="number"
                        step="any"
                        defaultValue={field.value}
                        onChange={(e) => setSettingsDraft((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={async () => {
                    if (!portalSession?.access_token) return;
                    const updates: Record<string, number> = {};
                    for (const [k, v] of Object.entries(settingsDraft)) if (v !== "") updates[k] = Number(v);
                    try {
                      const response = await fetch("/api/settings", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${portalSession.access_token}` },
                        body: JSON.stringify({ action: "update", updates }),
                      });
                      if (!response.ok) throw new Error((await response.json()).error || "Falha ao salvar.");
                      if (updates.bndes_annual_rate != null) setBndesAnnualRate(updates.bndes_annual_rate);
                      if (updates.bndes_grace_months != null) setBndesGraceMonths(updates.bndes_grace_months);
                      if (updates.factory_discount_percent != null) setFactoryDiscountPercent(updates.factory_discount_percent);
                      if (updates.locacao_rent_percent != null) setLocacaoRentPercent(updates.locacao_rent_percent);
                      if (updates.locacao_commission_percent != null) setLocacaoCommissionPercent(updates.locacao_commission_percent);
                      if (updates.locacao_installment_percent != null) setLocacaoInstallmentPercent(updates.locacao_installment_percent);
                      if (updates.bndes_min_revenue_multiplier != null) setBndesMinRevenueMultiplier(updates.bndes_min_revenue_multiplier);
                      if (updates.bndes_min_years_founded != null) setBndesMinYearsFounded(updates.bndes_min_years_founded);
                      if (updates.bndes_min_documents != null) setBndesMinDocuments(updates.bndes_min_documents);
                      triggerToast("Configurações salvas com sucesso.", "success");
                    } catch (error: any) {
                      triggerToast(error.message || "Não foi possível salvar.", "error");
                    }
                  }}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Salvar Configurações
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl text-white shadow-xl">
                <div className="flex flex-col md:flex-row justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl text-white shadow-xl">
                <div className="flex flex-col md:flex-row justify-between gap-4 pb-5 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/20"><Building className="w-6 h-6" /></div>
                    <div><span className="text-sm font-bold tracking-wider font-mono uppercase text-blue-400">Canal de Parceria BNDES</span><h3 className="text-xl font-bold font-display mt-1">Portal de Crédito BNDES</h3><p className="text-xs text-slate-400">Ficha cadastral, condições de aprovação e documentos do financiamento.</p></div>
                  </div>
                  <span className="self-start px-3 py-1 bg-blue-500/20 text-blue-300 font-bold rounded-full uppercase text-[10px]">BNDES Finame</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
                  <div className="space-y-3"><h4 className="text-xs font-bold uppercase text-slate-400">Ficha Cadastral</h4>
                    <input value={bndesRazaoSocial} onChange={(e) => setBndesRazaoSocial(e.target.value)} placeholder="Razão Social" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs" />
                    <input value={bndesCnpj} onChange={(e) => setBndesCnpj(e.target.value)} placeholder="CNPJ" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs" />
                    <input value={bndesRepresentative} onChange={(e) => setBndesRepresentative(e.target.value)} placeholder="Representante legal" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs" />
                  </div>
                  <div className="space-y-3"><h4 className="text-xs font-bold uppercase text-slate-400">Condições de Aprovação</h4>
                    <p className="bg-slate-800/60 rounded-xl p-3 text-xs">Faturamento anual: <strong>R$ {bndesAnnualRevenue.toLocaleString("pt-BR")}</strong></p>
                    <input type="number" value={bndesAnnualRevenue} onChange={(e) => setBndesAnnualRevenue(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs" />
                    <p className="bg-slate-800/60 rounded-xl p-3 text-xs">Status: {bndesAnnualRevenue >= financeAnalysis.investment * 2 ? "Crédito pré-aprovado" : "Aguardando revisão"}</p>
                  </div>
                  <div><h4 className="text-xs font-bold uppercase text-slate-400 mb-3">Documentação</h4><label className="flex flex-col items-center border-2 border-dashed border-slate-700 rounded-xl p-5 cursor-pointer text-xs"><Upload className="w-6 h-6 mb-2 text-blue-400" />Escolher Arquivo<input type="file" className="hidden" accept="application/pdf,image/*" onChange={handleBndesUpload} multiple /></label><p className="mt-3 text-xs text-slate-400">{bndesDocuments.length} documento(s) verificado(s) via AI</p></div>
                </div>
              </div>
              {/* Portfolio stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Investimento de Portfólio</span>
                  <span className="text-xl font-bold text-slate-900 mt-1 block">R$ {financeAnalysis.investment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  <p className="text-[9px] text-emerald-600 font-semibold mt-1">
                    {(() => {
                      const qty = selectedOption === "venda" ? quantityVenda : quantityLocacao;
                      return `${qty} ${qty === 1 ? "Gerador Ativo" : "Geradores Ativos"}`;
                    })()}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Receita Mensal Esperada</span>
                  <span className="text-xl font-bold text-slate-900 mt-1 block">R$ {financeAnalysis.clientPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  <p className="text-[9px] text-slate-500 mt-1">Garantido por Locação Comercial</p>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">TIR Acumulada do Ativo</span>
                  <span className="text-xl font-bold text-indigo-600 mt-1 block">{(financeAnalysis.tir * 100).toFixed(1)}% a.a.</span>
                  <p className="text-[9px] text-slate-500 mt-1">ROI real estimado de {financeAnalysis.roi.toFixed(0)}%</p>
                </div>
              </div>

              {/* Debt and Cash Flow Tables */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col gap-6 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Cronograma e Projeção Financeira</h3>
                  <p className="text-xs text-slate-500">Detalhamento mês a mês dos recebíveis, amortizações BNDES e fluxo de caixa líquido</p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-mono text-slate-500 uppercase">
                        <th className="p-3">Mês</th>
                        <th className="p-3">Status Contrato</th>
                        <th className="p-3">Investimento</th>
                        <th className="p-3">Entrada Locação</th>
                        {selectedOption === "venda" && <th className="p-3">Amortização BNDES</th>}
                        <th className="p-3">Fluxo Líquido</th>
                        <th className="p-3">Rentabilidade</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-mono">
                      <tr className="border-b border-slate-100 bg-emerald-50/30">
                        <td className="p-3 text-slate-900 font-bold">Mês 0</td>
                        <td className="p-3 text-slate-500">Fabricação / Setup</td>
                        <td className="p-3 text-rose-600">- R$ {financeAnalysis.investment.toLocaleString("pt-BR")}</td>
                        <td className="p-3 text-slate-500">R$ 0,00</td>
                        {selectedOption === "venda" && <td className="p-3">R$ 0,00</td>}
                        <td className="p-3 text-rose-600">- R$ {financeAnalysis.investment.toLocaleString("pt-BR")}</td>
                        <td className="p-3 text-slate-500">Setup Inicial</td>
                      </tr>
                      {/* Months representation */}
                      {(() => {
                        const grace = financeAnalysis.gargantuaGracePeriod;
                        const monthsToShow = [1];
                        if (grace > 1) {
                          monthsToShow.push(grace);
                        }
                        monthsToShow.push(grace + 1);
                        monthsToShow.push(grace + 12);
                        monthsToShow.push(grace + 24);
                        monthsToShow.push(grace + 36);
                        monthsToShow.push(grace + 48);
                        monthsToShow.push(grace + 60);

                        return monthsToShow.map((month) => {
                          const isGrace = month <= grace;
                          const payment = isGrace ? 0 : financeAnalysis.clientPayment;
                          const bndesPayment = selectedOption === "venda" && financeAnalysis.bndesSimulation ? financeAnalysis.bndesSimulation.monthlyPayment : 0;
                          const netFlow = payment - bndesPayment;
                          return (
                            <tr key={month} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-3 text-slate-900 font-bold">Mês {month}</td>
                              <td className="p-3">
                                {isGrace ? (
                                  <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-mono font-medium">
                                    Carência {month === grace ? "(Último mês)" : ""}
                                  </span>
                                ) : (
                                  <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-mono font-medium">
                                    Contrato (Faturamento {month - grace}/60)
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-slate-400">R$ 0,00</td>
                              <td className="p-3 text-slate-800">R$ {payment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                              {selectedOption === "venda" && (
                                <td className="p-3 text-rose-600">- R$ {bndesPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                              )}
                              <td className={`p-3 font-semibold ${netFlow > 0 ? "text-emerald-600" : netFlow === 0 ? "text-slate-400" : "text-rose-600"}`}>
                                R$ {netFlow.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="p-3 text-slate-500">
                                {isGrace ? "Ativo em carência" : `${((financeAnalysis.clientPayment / financeAnalysis.investment) * 100).toFixed(1)}% / mês`}
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PORTAL DO CLIENTE */}          
          {activeTab === "cliente" && financeAnalysis && (
            <div className="flex flex-col gap-6 animate-fade-in">
              
              {/* Card 1: Lista de Propostas */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Minhas Propostas</h3>
                    <p className="text-xs text-slate-500">Selecione uma proposta para ver os detalhes em destaque.</p>
                  </div>
                  <button 
                    onClick={() => portalSession && loadClientProposals(portalSession)} 
                    className="text-xs font-bold text-emerald-700"
                  >
                    Atualizar
                  </button>
                </div>
                
                {clientProposals.length ? (
                  <div className="space-y-2">
                    {clientProposals.map((proposal) => (
                      <div
                        key={proposal.proposal_number}
                        onClick={() => setSelectedClientProposal(proposal)}
                        className={`border rounded-xl p-3 cursor-pointer transition-colors ${selectedClientProposal?.proposal_number === proposal.proposal_number ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:bg-slate-50"}`}
                      >
                        <p className="text-sm font-semibold text-slate-800">{proposal.proposal_number} · {proposal.generator_kva || "—"} KVA</p>
                        <p className="text-xs text-slate-500">{proposal.commercial_model === "venda" ? "Venda Direta / BNDES" : "Locação Estruturada"} · {new Date(proposal.created_at).toLocaleDateString("pt-BR")}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Nenhuma proposta disponível para este acesso.</p>
                )}
              </div>

              {/* Card 2: Proposta Selecionada (Exibida dinamicamente) */}
              {selectedClientProposal && (
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-emerald-400 font-bold">Proposta selecionada</p>
                      <h3 className="text-lg font-bold">{selectedClientProposal.proposal_number}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-400">
                        {selectedClientProposal.investment ? selectedClientProposal.investment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}
                      </p>
                      <p className="text-[10px] text-slate-400">Investimento total</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div><p className="text-slate-400 text-[10px] uppercase">Potência</p><p className="font-bold">{selectedClientProposal.generator_kva || "—"} KVA</p></div>
                    <div><p className="text-slate-400 text-[10px] uppercase">Modelo</p><p className="font-bold">{selectedClientProposal.commercial_model === "venda" ? "Venda/BNDES" : "Locação"}</p></div>
                    <div><p className="text-slate-400 text-[10px] uppercase">Cliente</p><p className="font-bold">{selectedClientProposal.customer_name || "—"}</p></div>
                    <div><p className="text-slate-400 text-[10px] uppercase">Emitida em</p><p className="font-bold">{new Date(selectedClientProposal.created_at).toLocaleDateString("pt-BR")}</p></div>
                  </div>
                  <details>
                    <summary className="cursor-pointer text-xs font-bold text-emerald-400">Ver proposta completa</summary>
                    <pre className="mt-3 text-xs whitespace-pre-wrap font-sans text-slate-300 bg-slate-800 rounded-lg p-3">{selectedClientProposal.proposal_content}</pre>
                  </details>
                </div>
              )}              
              
              {/* Card 3: Simulador de Telemetria e Comparativo de Custos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Comparativo Financeiro */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between gap-6 shadow-sm">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">Seu Plano de Economia Energética</h3>
                    <p className="text-xs text-slate-500">Comparação financeira de custo antes e após implantação do gerador OCTA</p>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-2">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-full text-center">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Custo Antigo (Média)</span>
                      <p className="text-lg font-bold text-rose-600 mt-1 font-mono">R$ {electricityBill.valorConta.toLocaleString("pt-BR")}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block">Pago para Concessionária</span>
                    </div>

                    <div className="w-8 flex items-center justify-center text-slate-400">
                      →
                    </div>

                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 w-full text-center">
                      <span className="text-[10px] text-emerald-700 font-mono uppercase block font-bold">Novo Custo Mensal</span>
                      <p className="text-lg font-bold text-emerald-700 mt-1 font-mono">R$ {financeAnalysis.clientPayment.toLocaleString("pt-BR")}</p>
                      <span className="text-[9px] text-emerald-600 mt-1 block font-medium">Economia Garantida de 50%</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600">
                    <div className="flex justify-between items-center mb-2">
                      <span>Equipamento:</span>
                      <strong className="text-slate-900">
                        {selectedGenerator.capacityKva} KVA Cinético ({selectedOption === "venda" ? quantityVenda : quantityLocacao} {selectedOption === "venda" ? (quantityVenda === 1 ? "unidade" : "unidades") : (quantityLocacao === 1 ? "unidade" : "unidades")})
                      </strong>
                    </div>
                    {selectedOption !== "venda" ? (
                      <div className="flex justify-between items-center">
                        <span>Período de Carência Comercial:</span>
                        <strong className="text-blue-700">{financeAnalysis.gargantuaGracePeriod} Meses (Você economiza 100%)</strong>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span>Carência de Amortização (BNDES):</span>
                        <strong className="text-slate-700">{bndesGraceMonths} Meses</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Telemetria do Ativo */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between gap-4 shadow-sm">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-base font-bold text-slate-900">Status do Ativo no Cliente</h3>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Dados simulados de geração mecânica contínua do equipamento</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-200">
                      <span className="text-[9px] text-slate-400 uppercase font-mono block font-bold">Velocidade</span>
                      <strong className="text-slate-900 text-base mt-1 block">1.800 RPM</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-200">
                      <span className="text-[9px] text-slate-400 uppercase font-mono block font-bold">Frequência</span>
                      <strong className="text-slate-900 text-base mt-1 block">60.0 Hz</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-200">
                      <span className="text-[9px] text-slate-400 uppercase font-mono block font-bold">Disponibilidade</span>
                      <strong className="text-emerald-600 text-base mt-1 block font-extrabold">100%</strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div className="flex justify-between text-slate-500 mb-1.5">
                      <span>Geração Diária Média:</span>
                      <strong className="text-slate-900 font-bold">
                        {Math.round((selectedGenerator.generationKwh * (selectedOption === "venda" ? quantityVenda : quantityLocacao)) / 30).toLocaleString("pt-BR")} kWh/dia
                      </strong>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[90%]"></div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Card 4: Área de Suporte Técnico e Helpdesk */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Formulário para Abrir Chamado */}
                <div className="lg:col-span-1 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Abrir Chamado de Suporte</h4>
                  
                  <form onSubmit={handleCreateTicket} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-600 font-medium">Assunto</label>
                      <input 
                        type="text"
                        value={newTicketSubject}
                        onChange={(e) => setNewTicketSubject(e.target.value)}
                        placeholder="Ex: Agendar vistoria técnica"
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-600 font-medium">Categoria</label>
                      <select
                        value={newTicketCat}
                        onChange={(e) => setNewTicketCat(e.target.value as any)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all cursor-pointer"
                      >
                        <option value="técnico">Técnico / Engenharia</option>
                        <option value="financeiro">Financeiro / Faturamento</option>
                        <option value="manutenção">Manutenção Preventiva</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-600 font-medium">Descrição</label>
                      <textarea
                        value={newTicketDesc}
                        onChange={(e) => setNewTicketDesc(e.target.value)}
                        placeholder="Escreva detalhes da solicitação..."
                        rows={3}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all resize-none"
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Enviar Chamado Técnico
                    </button>
                  </form>
                </div>

                {/* Histórico de Chamados */}
                <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900">Seus Chamados e Solicitações</h4>
                  
                  <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                    {tickets.map(tck => (
                      <div key={tck.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-400">TCK-{tck.id.slice(0, 8).toUpperCase()}</span>
                            <span className="text-xs font-semibold text-slate-900">{tck.subject}</span>
                          </div>
                          <p className="text-xs text-slate-600">{tck.description}</p>
                          <span className="text-[10px] text-slate-400 mt-1 font-mono">Aberto em: {new Date(tck.created_at).toLocaleDateString("pt-BR")}</span>

                          {tck.ticket_replies?.length > 0 && (
                            <div className="mt-2 space-y-1.5 bg-white rounded-lg p-2.5 border border-slate-200">
                              {tck.ticket_replies.map((reply: any) => (
                                <p key={reply.id} className="text-xs">
                                  <span className="font-bold text-emerald-700">Suporte OCTA:</span>{" "}
                                  <span className="text-slate-600">{reply.message}</span>
                                </p>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          {tck.status === "aberto" && (
                            <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-mono font-medium">
                              Aberto
                            </span>
                          )}
                          {tck.status === "em_atendimento" && (
                            <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full font-mono font-medium">
                              Em Atendimento
                            </span>
                          )}
                          {tck.status === "resolvido" && (
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-mono font-medium">
                              Resolvido
                            </span>
                          )}
                          {tck.status === "cancelado" && (
                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-full font-mono font-medium">
                              Cancelado
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              
            </div>
          )}
          {activeTab === "admin-tickets" && portalRole === "admin" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                  <div><h3 className="text-base font-bold text-slate-900">Painel Admin: Chamados</h3><p className="text-xs text-slate-500">Todos os chamados abertos pelos clientes.</p></div>
                  <div className="flex gap-2 items-center">
                    <select value={adminTicketFilter} onChange={(e) => setAdminTicketFilter(e.target.value)} className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs">
                      <option value="">Todos os status</option>
                      <option value="aberto">Aberto</option>
                      <option value="em_atendimento">Em Atendimento</option>
                      <option value="resolvido">Resolvido</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                    <input value={adminTicketSearch} onChange={(e) => setAdminTicketSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadAdminTickets()} placeholder="Buscar por cliente/assunto" className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs" />
                    <button onClick={loadAdminTickets} className="text-xs font-bold text-emerald-700 px-2">Buscar</button>
                  </div>
                </div>
                {adminTickets.length ? (
                  <div className="space-y-4">
                    {adminTickets.map((tck) => (
                      <div key={tck.id} className="border border-slate-200 rounded-xl p-4">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400">TCK-{tck.id.slice(0, 8).toUpperCase()}</span>
                            <p className="text-sm font-semibold text-slate-900">{tck.subject}</p>
                            <p className="text-xs text-slate-500">{tck.client?.display_name || tck.client?.email || "Cliente sem nome"} · {tck.category}</p>
                          </div>
                          <select
                            value={tck.status}
                            onChange={(e) => submitAdminTicketUpdate(tck.id, e.target.value)}
                            className="border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold"
                          >
                            <option value="aberto">Aberto</option>
                            <option value="em_atendimento">Em Atendimento</option>
                            <option value="resolvido">Resolvido</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </div>
                        <p className="text-xs text-slate-600 mt-2">{tck.description}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">Aberto em {new Date(tck.created_at).toLocaleDateString("pt-BR")} · Atualizado em {new Date(tck.updated_at).toLocaleDateString("pt-BR")}</p>

                        {tck.ticket_replies?.length > 0 && (
                          <div className="mt-3 space-y-2 bg-slate-50 rounded-lg p-3">
                            {tck.ticket_replies.map((reply: any) => (
                              <div key={reply.id} className="text-xs">
                                <span className={`font-bold ${reply.author_role === "admin" ? "text-emerald-700" : "text-slate-700"}`}>
                                  {reply.author_role === "admin" ? "Você (admin)" : "Cliente"}:
                                </span>{" "}
                                <span className="text-slate-600">{reply.message}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2 mt-3">
                          <input
                            value={adminReplyDrafts[tck.id] || ""}
                            onChange={(e) => setAdminReplyDrafts((prev) => ({ ...prev, [tck.id]: e.target.value }))}
                            placeholder="Escrever resposta ao cliente..."
                            className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-xs"
                          />
                          <button onClick={() => submitAdminTicketUpdate(tck.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold">Responder</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-slate-500">Nenhum chamado encontrado.</p>}
              </div>
            </div>
          )}

          {activeTab === "admin-proposals" && portalRole === "admin" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                  <div><h3 className="text-base font-bold text-slate-900">Painel Admin: Propostas</h3><p className="text-xs text-slate-500">Vincule propostas geradas a um perfil de cliente cadastrado.</p></div>
                  <div className="flex gap-2 items-center">
                    <input value={adminProposalSearch} onChange={(e) => setAdminProposalSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadAdminProposals()} placeholder="Buscar por número/cliente" className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs" />
                    <button onClick={loadAdminProposals} className="text-xs font-bold text-emerald-700 px-2">Buscar</button>
                  </div>
                </div>
                {adminProposals.length ? (
                  <div className="space-y-3">
                    {adminProposals.map((prop) => (
                      <div key={prop.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{prop.proposal_number} · {prop.generator_kva || "—"} KVA</p>
                          <p className="text-xs text-slate-500">{prop.customer_name || prop.customer_email} · {new Date(prop.created_at).toLocaleDateString("pt-BR")}</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {prop.client ? <>Vinculada a: <span className="font-semibold text-emerald-700">{prop.client.display_name || prop.client.email}</span></> : <span className="text-amber-600 font-semibold">Sem cliente vinculado</span>}
                          </p>
                        </div>
                        <select
                          value={prop.owner_id || ""}
                          onChange={(e) => linkProposalToClient(prop.id, e.target.value)}
                          className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-semibold"
                        >
                          <option value="">— Sem cliente —</option>
                          {adminClients.map((c) => (
                            <option key={c.id} value={c.id}>{c.display_name || c.email}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-slate-500">Nenhuma proposta encontrada.</p>}
              </div>
            </div>
          )}
          
          {/* TAB 6: CRM / LEADS */}
          {activeTab === "crm" && financeAnalysis && portalRole === "admin" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Kanban Pipeline Stages */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Pipeline de Oportunidades Integrado</h3>
                    <p className="text-xs text-slate-500">Acompanhamento comercial de leads de grande porte, dimensionamento de gerador e status do projeto</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <input value={newLeadName} onChange={(e) => setNewLeadName(e.target.value)} placeholder="Nome" className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs flex-1 min-w-[120px]" />
                  <input value={newLeadCompany} onChange={(e) => setNewLeadCompany(e.target.value)} placeholder="Empresa" className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs flex-1 min-w-[120px]" />
                  <input value={newLeadPhone} onChange={(e) => setNewLeadPhone(e.target.value)} placeholder="Telefone" className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs w-32" />
                  <input value={newLeadEmail} onChange={(e) => setNewLeadEmail(e.target.value)} placeholder="E-mail" className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs flex-1 min-w-[140px]" />
                  <input value={newLeadBillValue} onChange={(e) => setNewLeadBillValue(e.target.value)} placeholder="Valor da conta (R$)" type="number" className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs w-36" />
                  <input value={newLeadAgent} onChange={(e) => setNewLeadAgent(e.target.value)} placeholder="Responsável" className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs w-32" />
                  <button onClick={handleAddLead} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold">+ Novo Lead</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {(["leads", "proposal", "negotiation", "closed", "implantação"] as const).map(stage => {
                    const leadsInStage = crmLeads.filter(lead => lead.stage === stage);
                    return (
                      <div key={stage} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3 min-h-[250px]">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">{stage}</span>
                          <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                            {leadsInStage.length}
                          </span>
                        </div>

                        <div className="flex flex-col gap-3">
                          {leadsInStage.map(lead => {
                            const estKva = lead.billValue >= 200000 ? 500 : lead.billValue >= 100000 ? 250 : 100;
                            return (
                              <div key={lead.id} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-2 relative group hover:border-emerald-500/40 hover:shadow-xs transition-all">
                                <div className="flex justify-between items-start">
                                  <span className="text-[9px] text-slate-400 font-mono">{lead.id}</span>
                                </div>
                                <span className="text-xs font-bold text-slate-900 block truncate">{lead.company}</span>
                                <div className="flex justify-between items-center text-[10px] text-slate-500">
                                  <span>{lead.name}</span>
                                  <span className="font-mono font-medium text-slate-700">{estKva} KVA</span>
                                </div>
                                
                                {/* Stage controls */}
                                <div className="flex gap-1 border-t border-slate-100 pt-2 mt-1">
                                  {stage !== "leads" && (
                                    <button 
                                      onClick={() => {
                                        const stages: CRMLead["stage"][] = ["leads", "proposal", "negotiation", "closed", "implantação"];
                                        const prevIdx = stages.indexOf(stage) - 1;
                                        handleLeadStageUpdate(lead.id, stages[prevIdx]);
                                      }}
                                      className="text-[9px] text-slate-500 hover:text-slate-900 px-1.5 py-0.5 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer transition-colors"
                                    >
                                      ←
                                    </button>
                                  )}
                                  {stage !== "implantação" && (
                                    <button 
                                      onClick={() => {
                                        const stages: CRMLead["stage"][] = ["leads", "proposal", "negotiation", "closed", "implantação"];
                                        const nextIdx = stages.indexOf(stage) + 1;
                                        handleLeadStageUpdate(lead.id, stages[nextIdx]);
                                      }}
                                      className="text-[9px] text-slate-600 hover:text-emerald-700 px-1.5 py-0.5 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 ml-auto cursor-pointer transition-colors font-medium"
                                    >
                                      Avançar →
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CATÁLOGO & PREÇOS */}
          {activeTab === "catalogo" && (
            <div className="flex flex-col gap-8 animate-fade-in">
              
              {/* SECTION 1: SALES PRICE TABLE */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <span className="text-[10px] text-emerald-600 font-mono uppercase tracking-wider font-bold block mb-1">Tabela de Vendas Oficial</span>
                  <h3 className="text-lg font-bold text-slate-900">Tabela de Preços - Geradores de Energia Cinético 100% Ecológico</h3>
                  <p className="text-xs text-slate-500 mt-1">Valores oficiais de aquisição direta. Clique em "Simular" para carregar o modelo instantaneamente na simulação financeira.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-600 font-mono uppercase text-[10px] tracking-wider">
                        <th className="p-3 font-semibold">Modelo</th>
                        <th className="p-3 font-semibold text-center">Capacidade</th>
                        <th className="p-3 font-semibold text-center">Potência (kW)</th>
                        <th className="p-3 font-semibold text-center">Geração Mensal Est.</th>
                        <th className="p-3 font-semibold text-right">Preço de Venda</th>
                        <th className="p-3 font-semibold text-right">Locação Ref. (Mensal)</th>
                        <th className="p-3 font-semibold text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {GENERATORS_CATALOG.map((gen) => (
                        <tr key={gen.capacityKva} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-medium text-slate-900 font-mono">{gen.name || `OCTA ${gen.capacityKva}`}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded-full font-mono text-[10px]">
                              {gen.capacityKva} kVA
                            </span>
                          </td>
                          <td className="p-3 text-center font-mono text-slate-600">{gen.powerKw} kW</td>
                          <td className="p-3 text-center font-mono text-emerald-700 font-semibold">
                            {Math.round(gen.generationKwh).toLocaleString("pt-BR")} kWh
                          </td>
                          <td className="p-3 text-right font-bold text-slate-900">
                            R$ {gen.vendaPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-right font-semibold text-indigo-600">
                            R$ {gen.locacaoRefPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setSelectedGenerator(gen);
                                triggerToast(`OCTA ${gen.capacityKva} carregado no simulador!`, "success");
                                setActiveTab("financeiro");
                              }}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold shadow-xs transition-all cursor-pointer"
                            >
                              Simular
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 2: INTERACTIVE PRODUCT CATALOG */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
                <div className="border-b border-slate-100 pb-5 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-[10px] text-blue-600 font-mono uppercase tracking-wider font-bold block mb-1">Catálogo Corporativo OCTA ENERGIA</span>
                      <h3 className="text-xl font-bold text-slate-900">Nossos Geradores Carenados Silenciados</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Nossa linha de Geradores Magnéticos Cinéticos de Base é protegida por carenagens acústicas e térmicas de alta vedação, oferecendo baixíssimo nível de ruído e pintura epóxi antioxidante de longa vida útil.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <button
                        onClick={() => {
                          setShowCatalogPrintModal(true);
                          triggerToast("Preparando Catálogo Corporativo em PDF...", "info");
                        }}
                        className="w-full md:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                        title="Gerar catálogo técnico-comercial completo em PDF"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Gerar Catálogo em PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter and Search controls */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 pt-5 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                      <span className="text-[10px] text-slate-400 font-mono uppercase font-bold mr-1.5">Filtrar Carga:</span>
                      <button
                        onClick={() => setCatalogFilter("all")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          catalogFilter === "all"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        Todos os Modelos
                      </button>
                      <button
                        onClick={() => setCatalogFilter("compact")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          catalogFilter === "compact"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        15kVA - 150kVA
                      </button>
                      <button
                        onClick={() => setCatalogFilter("medium")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          catalogFilter === "medium"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        200kVA - 300kVA
                      </button>
                      <button
                        onClick={() => setCatalogFilter("heavy")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          catalogFilter === "heavy"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        350kVA - 1MW
                      </button>
                    </div>

                    <div className="relative w-full md:w-64">
                      <input
                        type="text"
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        placeholder="Buscar modelo ou segmento..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Grid of generator cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {GENERATORS_CATALOG.filter(gen => {
                    const nameMatch = (gen.name || "").toLowerCase().includes(catalogSearch.toLowerCase()) || 
                                      (gen.segment || "").toLowerCase().includes(catalogSearch.toLowerCase()) || 
                                      String(gen.capacityKva).includes(catalogSearch);
                    if (!nameMatch) return false;
                    if (catalogFilter === "compact") return gen.capacityKva >= 15 && gen.capacityKva <= 150;
                    if (catalogFilter === "medium") return gen.capacityKva >= 200 && gen.capacityKva <= 300;
                    if (catalogFilter === "heavy") return gen.capacityKva >= 350;
                    return true;
                  }).map((gen) => (
                    <div 
                      key={gen.capacityKva} 
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col group hover:border-emerald-500/40 hover:shadow-md transition-all duration-300"
                    >
                      {/* Product Image */}
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        <img 
                          src={gen.imageUrl} 
                          alt={gen.name}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                          <span className="px-2 py-0.5 bg-emerald-500 text-white font-mono text-[9px] font-bold uppercase rounded-md shadow-sm">
                            {gen.capacityKva} kVA
                          </span>
                          <span className="px-2 py-0.5 bg-slate-900/85 text-emerald-400 font-mono text-[9px] font-bold uppercase rounded-md shadow-sm">
                            Sustentável
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 z-10">
                          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-xs text-slate-800 font-mono text-[9px] font-bold uppercase rounded-md shadow-sm">
                            Eficiência 97%
                          </span>
                        </div>
                      </div>

                      {/* Product details */}
                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase tracking-wider block">
                            {gen.segment}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {gen.name}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed mt-1">
                            {gen.description}
                          </p>
                        </div>

                        {/* Specification list */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono">
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase">Voltagem Útil</span>
                            <span className="text-slate-800 font-semibold">{gen.voltagem}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase">Frequência VCA</span>
                            <span className="text-slate-800 font-semibold">{gen.frequencia}</span>
                          </div>
                          <div className="mt-1">
                            <span className="text-slate-400 block text-[9px] uppercase">Área Ocupada</span>
                            <span className="text-slate-800 font-semibold">{gen.area}</span>
                          </div>
                          <div className="mt-1">
                            <span className="text-slate-400 block text-[9px] uppercase">Rendimento</span>
                            <span className="text-slate-800 font-semibold text-emerald-600">{gen.rendimento}</span>
                          </div>
                        </div>

                        {/* Bullets/Highlights */}
                        {gen.highlights && gen.highlights.length > 0 && (
                          <div className="flex flex-col gap-1">
                            {gen.highlights.map((hl, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-600">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{hl}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action and Pricing */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-400 font-mono uppercase">Preço de Venda</span>
                            <span className="text-sm font-bold text-slate-900">
                              R$ {gen.vendaPrice.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                            </span>
                            <span className="text-[8px] text-indigo-500 font-mono">Locação: R$ {gen.locacaoRefPrice.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}/mês</span>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedGenerator(gen);
                              triggerToast(`OCTA ${gen.capacityKva} carregado no simulador!`, "success");
                              setActiveTab("financeiro");
                            }}
                            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-xs hover:shadow-md cursor-pointer"
                          >
                            Selecionar Modelo
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Corporate Technical Footer */}
          <footer className="border-t border-slate-200/60 mt-8 pt-4 pb-2">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                <span>© 2026 OCTA ENERGY ENTERPRISE. Todos os direitos reservados.</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> LGPD Certificado</span>
                <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5 text-emerald-500" /> Banco PostgreSQL integrado</span>
              </div>
            </div>
          </footer>

        </div>
      </main>
      
      {/* MODALS AND OVERLAYS */}
      {proposalEmailOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900">Enviar proposta ao cliente</h3>
            <p className="text-xs text-slate-500 mt-1">Informe um e-mail válido. A proposta e uma senha exclusiva para o Portal do Cliente serão enviadas para este endereço.</p>
            <input type="email" value={proposalEmail} onChange={(e) => setProposalEmail(e.target.value)} placeholder="cliente@empresa.com" className="mt-5 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm" />
            <div className="flex justify-end gap-2 mt-5"><button onClick={() => setProposalEmailOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600">Cancelar</button><button onClick={() => { if (!/^\S+@\S+\.\S+$/.test(proposalEmail)) return triggerToast("Informe um e-mail válido.", "error"); setProposalEmailOpen(false); if (proposalAction === "print" && generatedProposal) { saveAndEmailProposal(proposalEmail, generatedProposal).catch((error) => triggerToast(error.message, "error")); setShowPrintModal(true); } else generateProposal(proposalEmail); }} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">Continuar</button></div>
          </div>
        </div>
      )}

      {portalLoginOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between gap-4"><div><h3 className="text-lg font-bold text-slate-900">Portais Compartilhados</h3><p className="text-xs text-slate-500 mt-1">Acesse com e-mail ou número da proposta e senha.</p></div><button onClick={() => setPortalLoginOpen(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
            {!isSupabaseConfigured() && <p className="mt-4 p-3 rounded-xl bg-amber-50 text-amber-800 text-xs">Configure as variáveis públicas do Supabase na Vercel para ativar o acesso.</p>}
            <div className="flex gap-2 mt-5 text-xs font-bold"><button onClick={() => setPortalMode("login")} className={portalMode === "login" ? "text-emerald-700" : "text-slate-400"}>Entrar</button><button onClick={() => setPortalMode("register")} className={portalMode === "register" ? "text-emerald-700" : "text-slate-400"}>Criar conta</button><button onClick={() => setPortalMode("forgot")} className={portalMode === "forgot" ? "text-emerald-700" : "text-slate-400"}>Esqueci a senha</button></div>
            <div className="space-y-3 mt-4">{portalMode === "register" && <input value={portalName} onChange={(e) => setPortalName(e.target.value)} placeholder="Nome" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm" />}<input value={portalLogin} onChange={(e) => setPortalLogin(e.target.value)} placeholder={portalMode === "login" ? "E-mail ou número da proposta" : "E-mail"} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm" />{portalMode !== "forgot" && <input type="password" value={portalPassword} onChange={(e) => setPortalPassword(e.target.value)} placeholder="Senha" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm" />}</div>
            <button disabled={portalBusy || !isSupabaseConfigured()} onClick={submitPortalAccess} className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600 disabled:bg-slate-300 text-white text-sm font-bold flex items-center justify-center gap-2">
              {portalBusy && <RefreshCw className="w-4 h-4 animate-spin" />}
              {portalPolling
                ? "Aguardando confirmação do e-mail..."
                : portalBusy
                ? "Aguarde..."
                : portalMode === "forgot"
                ? "Enviar instruções"
                : portalMode === "register"
                ? "Criar acesso"
                : "Entrar no portal"}
            </button>
          </div>
        </div>
      )}
      {/* 1. PRINT PREVIEW MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8">
            {/* Modal Header (Hidden on print) */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Relatório Executivo & PDF Export</h3>
                <p className="text-xs text-slate-500 mt-1">Configure o documento antes de gerar a versão final para impressão ou salvamento.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    window.print();
                    triggerToast("Iniciando impressão... Escolha 'Salvar como PDF' na caixa de diálogo.", "success");
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Salvar como PDF</span>
                </button>
                
                <button
                  onClick={downloadDOCXProposal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  title="Baixar em formato Word (.doc)"
                >
                  <FileText className="w-4 h-4" />
                  <span>Baixar Word (DOC)</span>
                </button>

                <button
                  onClick={downloadHTMLProposal}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  title="Download como arquivo HTML autônomo com formatação original"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar HTML Oficial</span>
                </button>

                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Printable Area Wrapper */}
            <div className="p-8 overflow-y-auto max-h-[70vh] bg-slate-100 flex justify-center print:bg-white print:p-0 print:max-h-none print:overflow-visible">
              {/* Exact A4 simulation sheet */}
              <div 
                id="print-target-area" 
                className="bg-white w-full max-w-[210mm] min-h-[297mm] border border-slate-200 shadow-lg relative print:shadow-none print:border-none print:p-0"
              >
                <CorporateProposalLayout
                  generatedProposal={generatedProposal}
                  legalAuditReport={legalAuditReport}
                  selectedGenerator={selectedGenerator}
                  electricityBill={electricityBill}
                  financeAnalysis={financeAnalysis}
                  selectedOption={selectedOption}
                  vendaSplit50={vendaSplit50}
                  bndesDownPayment={bndesDownPayment}
                  locacaoInstallmentPercent={locacaoInstallmentPercent}
                  isRevised={isRevised}
                  isSigned={isSigned}
                  signerCpf={signerCpf}
                  signedAt={signedAt}
                  proposalFontSize={proposalFontSize}
                  quantityVenda={quantityVenda}
                  quantityLocacao={quantityLocacao}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DIGITAL SIGNATURE DIALOG */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Assinatura Digital ICP-Brasil</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Conclua o aceite formal do documento através de certificação digital segura.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome Completo do Signatário</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
                  value={electricityBill.clientName || "Representante Autorizado"}
                  disabled
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CPF ou CNPJ do Signatário</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="Ex: 123.456.789-00 ou 12.345.678/0001-00"
                  value={signerCpf}
                  onChange={(e) => setSignerCpf(e.target.value)}
                />
              </div>

              {(selectedOption === "locacao" || (selectedOption === "venda" && vendaSplit50)) && (
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-2">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide block">Regra de Fabricação (Aporte de Mobilização de Ativos)</span>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    O custo estrutural de fabricação e montagem do equipamento é lastreado pelo fluxo de caixa inicial acordado:
                  </p>
                  <div className="text-[10px] font-mono text-slate-850 space-y-1.5 bg-white p-2.5 rounded border border-slate-150">
                    {selectedOption === "venda" ? (
                      <>
                        <div>
                          <strong>1. Sinal de Entrada (50%):</strong> R$ {bndesDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pago no ato do pedido.
                        </div>
                        <div>
                          <strong>2. Saldo na Entrega e Posto em Marcha (50%):</strong> R$ {bndesDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pago mediante a entrega física e inicialização.
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <strong>1. Sinal de Fabricação ({locacaoInstallmentPercent}%):</strong> R$ {((financeAnalysis?.investment || 0) * (locacaoInstallmentPercent / 100)).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pago no ato da assinatura e emissão da ordem de produção.
                        </div>
                        <div>
                          <strong>2. Saldo na Entrega ({100 - locacaoInstallmentPercent}%):</strong> R$ {((financeAnalysis?.investment || 0) * ((100 - locacaoInstallmentPercent) / 100)).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pago mediante a entrega física e validação técnica.
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-start gap-2.5">
                <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-emerald-800 leading-relaxed">
                  Ao assinar, você valida formalmente os parâmetros técnicos do gerador cinético de <strong>{selectedGenerator.capacityKva} KVA</strong> e aceita as condições gerais de fornecimento estabelecidas na proposta.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setShowSignModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!signerCpf.trim()) {
                    triggerToast("Por favor, preencha o CPF ou CNPJ.", "error");
                    return;
                  }
                  const now = new Date();
                  const formattedDate = now.toLocaleString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                    dateStyle: "short",
                    timeStyle: "short"
                  });
                  setSignedAt(`${formattedDate} (Horário de Brasília)`);
                  setIsSigned(true);
                  setShowSignModal(false);
                  triggerToast("Documento assinado eletronicamente via ICP-Brasil!", "success");
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Confirmar Assinatura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATALOG PRINT PREVIEW MODAL */}
      {showCatalogPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8">
            {/* Modal Header (Hidden on print) */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Catálogo Oficial & PDF Export</h3>
                <p className="text-xs text-slate-500 mt-1">Gere a versão final impressa ou salve como PDF o catálogo corporativo completo.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    window.print();
                    triggerToast("Iniciando impressão... Escolha 'Salvar como PDF' na caixa de diálogo.", "success");
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Salvar como PDF</span>
                </button>
                
                <button
                  onClick={() => setShowCatalogPrintModal(false)}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Printable Area Wrapper */}
            <div className="p-8 overflow-y-auto max-h-[70vh] bg-slate-100 flex justify-center print:bg-white print:p-0 print:max-h-none print:overflow-visible">
              {/* Exact A4 simulation sheet */}
              <div 
                id="print-catalog-target-area" 
                className="bg-white w-full max-w-[210mm] border border-slate-200 shadow-lg relative print:shadow-none print:border-none print:p-0"
              >
                <CorporateCatalogLayout />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
