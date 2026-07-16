import { GeneratorModel, FinanceAnalysis } from "./types";

export const GENERATORS_CATALOG: GeneratorModel[] = [
  {
    capacityKva: 15,
    powerKw: 12,
    vendaPrice: 520000,
    locacaoRefPrice: 260000,
    generationKwh: 12 * 24 * 30 * 0.90,
    name: "OCTA 15 Carenado",
    segment: "Residencial e Comercial Leve",
    description: "Compacto e eficiente, projetado para residências de alto padrão e comércios de pequeno porte que necessitam de estabilidade total sem emissão de gases.",
    voltagem: "110 / 220 / 380 VCA",
    frequencia: "50 / 60 Hz",
    area: "2 a 3 m²",
    rendimento: "97% (Apenas 3% de perdas)",
    highlights: ["Operação extremamente silenciosa (<50 dB)", "Livre de combustão ou emissão de CO₂"],
    imageUrl: "/images/octa_compact_generator_1782531644439.jpg"
  },
  {
    capacityKva: 30,
    powerKw: 24,
    vendaPrice: 780000,
    locacaoRefPrice: 390000,
    generationKwh: 24 * 24 * 30 * 0.90,
    name: "OCTA 30 Carenado",
    segment: "Comercial e Pequeno Agronegócio",
    description: "Equipamento de segurança de energia robusto concebido para clínicas comerciais, padarias de alto fluxo e fazendas de transição energética rápida.",
    voltagem: "110 / 220 / 380 VCA",
    frequencia: "50 / 60 Hz",
    area: "3 a 5 m²",
    rendimento: "97% (Apenas 3% de perdas)",
    highlights: ["Carenagem de aço galvanizado antiferrugem", "Livre de combustão ou emissão de CO₂"],
    imageUrl: "/images/octa_compact_generator_1782531644439.jpg"
  },
  {
    capacityKva: 50,
    powerKw: 40,
    vendaPrice: 1080000,
    locacaoRefPrice: 540000,
    generationKwh: 40 * 24 * 30 * 0.90,
    name: "OCTA 50 Carenado",
    segment: "Pequena e Média Empresa",
    description: "Excelente estabilizador de base elétrica para escritórios de engenharia, pequenas fazendas produtivas e redes de varejo de médio porte.",
    voltagem: "110 / 220 / 380 VCA",
    frequencia: "50 / 60 Hz",
    area: "4 a 6 m²",
    rendimento: "97% (Apenas 3% de perdas)",
    highlights: ["Ampla isolação magnética de alta performance", "Controle digital integrado com CLP industrial"],
    imageUrl: "/images/octa_compact_generator_1782531644439.jpg"
  },
  {
    capacityKva: 100,
    powerKw: 80,
    vendaPrice: 1720000,
    locacaoRefPrice: 860000,
    generationKwh: 80 * 24 * 30 * 0.90,
    name: "OCTA 100 Carenado",
    segment: "Comercial e Agrícola",
    description: "Ideal para garantir a autonomia de pequenos negócios e propriedades agrícolas, oferecendo energia de forma contínua e sem interrupções das concessionárias.",
    voltagem: "110 / 220 / 380 VCA",
    frequencia: "50 / 60 Hz",
    area: "5 a 8 m²",
    rendimento: "97% (Apenas 3% de perdas)",
    highlights: ["Operação silenciosa (carenagem acústica)", "Livre de combustão ou emissão de CO₂"],
    imageUrl: "/images/octa_compact_generator_1782531644439.jpg"
  },
  {
    capacityKva: 150,
    powerKw: 120,
    vendaPrice: 1850000,
    locacaoRefPrice: 925000,
    generationKwh: 120 * 24 * 30 * 0.90,
    name: "OCTA 150 Carenado",
    segment: "Pequena e Média Empresa",
    description: "Perfeito para supermercados, condomínios de médio porte e pequenas indústrias que buscam se proteger de aumentos tarifários e apagões de rede.",
    voltagem: "110 / 220 / 380 VCA",
    frequencia: "50 / 60 Hz",
    area: "6 a 10 m²",
    rendimento: "97% (Apenas 3% de perdas)",
    highlights: ["Operação contínua 24/7 (Base Load)", "Cabine com isolamento térmico e acústico de alta performance"],
    imageUrl: "/images/octa_compact_generator_1782531644439.jpg"
  },
  {
    capacityKva: 200,
    powerKw: 160,
    vendaPrice: 1950000,
    locacaoRefPrice: 975000,
    generationKwh: 160 * 24 * 30 * 0.90,
    name: "OCTA 200 Carenado",
    segment: "Corporativo e Industrial",
    description: "Solução extremamente confiável para supermercados, condomínios corporativos integrados e indústrias de manufatura de médio fluxo.",
    voltagem: "220 / 380 / 440 VCA",
    frequencia: "50 / 60 Hz",
    area: "6 a 10 m²",
    rendimento: "97% (Apenas 3% de perdas)",
    highlights: ["Carenagem acústica isolante de alta performance", "Rendimento real constante sem fadiga mecânica"],
    imageUrl: "/images/octa_medium_generator_1782531660782.jpg"
  },
  {
    capacityKva: 250,
    powerKw: 200,
    vendaPrice: 2400000,
    locacaoRefPrice: 1200000,
    generationKwh: 200 * 24 * 30 * 0.90,
    name: "OCTA 250 Carenado",
    segment: "Indústria e Grandes Condomínios",
    description: "Modelo potente habilitado para operar tanto de forma isolada (Off-grid) como em paralelo com a concessionária para otimização de picos (Peak Shaving).",
    voltagem: "220 / 380 / 440 VCA",
    frequencia: "50 / 60 Hz",
    area: "8 a 12 m²",
    rendimento: "97% de eficiência eletromecânica",
    highlights: ["Sistema GAEL de propensão eletromecânica magnética", "Rotor de alta inércia assistido por neodímio"],
    imageUrl: "/images/octa_medium_generator_1782531660782.jpg"
  },
  {
    capacityKva: 300,
    powerKw: 240,
    vendaPrice: 2800000,
    locacaoRefPrice: 1400000,
    generationKwh: 240 * 24 * 30 * 0.90,
    name: "OCTA 300 Carenado (Modelo Premium)",
    segment: "Corporativo e Industrial",
    description: "Equipamento compacto e super sofisticado, projetado com acabamento bronze metálico perfurado e componentes magnéticos de alta resistência.",
    voltagem: "220 / 380 / 440 VCA",
    frequencia: "50 / 60 Hz",
    area: "8 a 15 m²",
    rendimento: "97% (Apenas ~3% de perdas projetadas)",
    highlights: ["Concepção avançada de baixíssimo ruído", "Interface digital de controle inteligente com monitoramento remoto IoT"],
    imageUrl: "/images/octa_medium_generator_1782531660782.jpg"
  },
  {
    capacityKva: 350,
    powerKw: 280,
    vendaPrice: 3000000,
    locacaoRefPrice: 1500000,
    generationKwh: 280 * 24 * 30 * 0.90,
    name: "OCTA 350 Carenado Premium",
    segment: "Industrial e Infraestrutura",
    description: "Projetado para infraestruturas comerciais robustas e condomínios industriais em crescimento que necessitam de transição imediata para base autônoma.",
    voltagem: "220 / 380 / 440 VCA",
    frequencia: "50 / 60 Hz",
    area: "9 a 16 m²",
    rendimento: "97% de eficiência contínua",
    highlights: ["Cabine com tampas laterais fechadas e blindadas contra intempéries", "Design aerodinâmico selado sem chaminés de escape ou silenciadores aparentes"],
    imageUrl: "/images/octa_heavy_generator_1782531673702.jpg"
  },
  {
    capacityKva: 400,
    powerKw: 320,
    vendaPrice: 3100000,
    locacaoRefPrice: 1550000,
    generationKwh: 320 * 24 * 30 * 0.90,
    name: "OCTA 400 Carenado Industrial",
    segment: "Alta Demanda Industrial",
    description: "Atendimento energético ininterrupto para indústrias petroquímicas e manufatureiras, oferecendo robustez eletromecânica sob severas variações de torque.",
    voltagem: "220 / 380 / 440 VCA",
    frequencia: "50 / 60 Hz",
    area: "10 a 17 m²",
    rendimento: "97% de rendimento permanente",
    highlights: ["Carenagem de isolamento térmico e acústico profundo (Tampas Laterais Seladas)", "Design flush sem descargas ou silenciadores externos visíveis"],
    imageUrl: "/images/octa_heavy_generator_1782531673702.jpg"
  },
  {
    capacityKva: 450,
    powerKw: 360,
    vendaPrice: 3200000,
    locacaoRefPrice: 1600000,
    generationKwh: 360 * 24 * 30 * 0.90,
    name: "OCTA 450 Carenado Super-Duty",
    segment: "Alta Demanda Industrial",
    description: "Usinado sob os mais rígidos preceitos de resiliência e operação continuada, cobrindo com folga cargas reativas pesadas e distorções harmônicas industriais.",
    voltagem: "220 / 380 / 440 VCA",
    frequencia: "50 / 60 Hz",
    area: "10 a 18 m²",
    rendimento: "97% (Altíssima linearidade de geração)",
    highlights: ["Carenagem de isolamento térmico e acústico profundo (Tampas Laterais Seladas)", "Design flush sem descargas ou silenciadores externos visíveis"],
    imageUrl: "/images/octa_heavy_generator_1782531673702.jpg"
  },
  {
    capacityKva: 500,
    powerKw: 500,
    vendaPrice: 3400000,
    locacaoRefPrice: 1700000,
    generationKwh: 500 * 24 * 30 * 0.90,
    name: "OCTA 500 Carenado Heavy-Duty",
    segment: "Alta Demanda Industrial",
    description: "Ideal para aplicações intensivas de manufatura, redes de grandes hotéis, agronegócio de grande escala e plantas de mineração.",
    voltagem: "220 / 380 / 440 VCA",
    frequencia: "50 / 60 Hz",
    area: "10 a 18 m²",
    rendimento: "97% de rendimento contínuo",
    highlights: ["Geração de 324.000 kWh/mês com fator de carga de 90%", "Cabine com tampas laterais fechadas e blindadas contra intempéries"],
    imageUrl: "/images/octa_heavy_generator_1782531673702.jpg"
  },
  {
    capacityKva: 1000,
    powerKw: 800,
    vendaPrice: 5800000,
    locacaoRefPrice: 2900000,
    generationKwh: 800 * 24 * 30 * 0.90,
    name: "OCTA 1MW Megawatt Station",
    segment: "Data Centers e Infraestrutura Crítica",
    description: "A solução definitiva em independência energética para grandes data centers de IA, infraestrutura hospitalar e pólos industriais metalúrgicos.",
    voltagem: "380 / 440 VCA ou Média Tensão",
    frequencia: "50 / 60 Hz",
    area: "15 a 30 m²",
    rendimento: "97% de rendimento permanente",
    highlights: ["Configuração modular em contêiner marítimo acústico blindado", "Múltiplas unidades operando em paralelo com facilidade"],
    imageUrl: "/images/octa_megawatt_station_1782531685594.jpg"
  }
];

// Recommends the best kinetic generator model based on monthly consumption in kWh
export function recommendGenerator(consumoKwh: number): GeneratorModel {
  // We want to cover as close to the consumption as possible, preferring to match or slightly exceed.
  // Standard power factor is 0.8, so Power Kw = KVA * 0.8.
  // Generation monthly = kW * 24 * 30 * 0.90.
  // Let's find the first generator that covers at least 90% of consumption, or the largest one.
  const idealModels = GENERATORS_CATALOG.filter(gen => gen.generationKwh >= consumoKwh * 0.9);
  if (idealModels.length > 0) {
    return idealModels[0];
  }
  // If even the 500 KVA isn't enough, return the 500 KVA
  return GENERATORS_CATALOG[GENERATORS_CATALOG.length - 1];
}

// Calculate Net Present Value (VPL)
export function calculateVPL(cashFlows: number[], annualRate: number): number {
  const r = annualRate / 12; // monthly discount rate
  let vpl = 0;
  for (let t = 0; t < cashFlows.length; t++) {
    vpl += cashFlows[t] / Math.pow(1 + r, t);
  }
  return vpl;
}

// Calculate Internal Rate of Return (TIR) using Secant Method
export function calculateTIR(cashFlows: number[]): number {
  let r0 = 0.1 / 12; // initial guess 10% annual
  let r1 = 0.2 / 12; // second guess 20% annual
  
  function vplForRate(r: number): number {
    let v = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      v += cashFlows[t] / Math.pow(1 + r, t);
    }
    return v;
  }

  let f0 = vplForRate(r0);
  let f1 = vplForRate(r1);

  // If initial outputs are identical or extremely small
  if (Math.abs(f1 - f0) < 1e-10) {
    return 0;
  }

  for (let i = 0; i < 100; i++) {
    if (Math.abs(f1 - f0) < 1e-12) break;
    const rNext = r1 - f1 * (r1 - r0) / (f1 - f0);
    r0 = r1;
    f0 = f1;
    r1 = rNext;
    f1 = vplForRate(r1);

    if (Math.abs(f1) < 1e-6) {
      break;
    }
  }

  // Convert monthly rate back to annual rate
  const annualTIR = r1 * 12;
  return isNaN(annualTIR) || !isFinite(annualTIR) ? 0 : annualTIR;
}

// Calculate BNDES Loan Schedule
export function simulateBndes(
  amount: number,
  annualRate: number,
  termMonths: number,
  graceMonths: number
) {
  const monthlyRate = annualRate / 12;
  const amortizationSchedule = [];
  let balance = amount;
  let totalInterest = 0;

  // During grace period, BNDES usually charges interest only (juros na carência), or capitalizes.
  // Let's assume interest-only payments during the grace period (very standard for BNDES).
  for (let m = 1; m <= graceMonths; m++) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    amortizationSchedule.push({
      month: m,
      payment: interest,
      amortization: 0,
      interest: interest,
      balance: balance
    });
  }

  // Remaining term for amortization (using standard Price table or SAC)
  // Let's use SAC (Sistema de Amortização Constante), which is the standard for BNDES!
  // In SAC: amortization is constant = Principal / amortizationMonths
  const amortizationMonths = termMonths - graceMonths;
  const constantAmortization = amortizationMonths > 0 ? amount / amortizationMonths : 0;

  for (let m = graceMonths + 1; m <= termMonths; m++) {
    const interest = balance * monthlyRate;
    const amortization = constantAmortization;
    const payment = amortization + interest;
    totalInterest += interest;
    balance -= amortization;

    amortizationSchedule.push({
      month: m,
      payment: payment,
      amortization: amortization,
      interest: interest,
      balance: Math.max(0, balance)
    });
  }

  // Average monthly payment for active amortization period
  const activePayments = amortizationSchedule.slice(graceMonths);
  const avgMonthlyPayment = activePayments.length > 0 
    ? activePayments.reduce((acc, curr) => acc + curr.payment, 0) / activePayments.length
    : 0;

  return {
    monthlyPayment: avgMonthlyPayment,
    totalInterest: totalInterest,
    amortizationSchedule
  };
}

// Complete economic feasibility analysis engine
export function performFeasibilityAnalysis(
  bill: { valorConta: number; consumoKwh: number; tarifa: number },
  generator: GeneratorModel,
  selectedOption: "venda" | "locacao",
  bndesParams?: { downPayment: number; annualRate: number; termMonths: number; graceMonths: number },
  factoryDiscountPercent?: number,
  locacaoParams?: { rentPercent: number; bonusMonths: number; contractMonths: number; commissionPercent: number; installmentPercent: number },
  quantityVenda: number = 1,
  quantityLocacao: number = 1
): FinanceAnalysis {
  const quantity = selectedOption === "venda" ? quantityVenda : quantityLocacao;

  // Let's calculate coverage based on total generation of all units
  const totalGeneration = generator.generationKwh * quantity;
  const coveragePercent = Math.min(100, Math.round((totalGeneration / bill.consumoKwh) * 100));
  
  // Economy generated (monthly savings in energy cost)
  // Calculated in parallel by the quantity of equipment
  const monthlySavings = totalGeneration * bill.tarifa;

  // Discount factor
  const discountFactor = 1 - (factoryDiscountPercent || 0) / 100;

  // Extract customizable lease parameters or use default values
  const rentPercent = locacaoParams?.rentPercent ?? 50;
  const bonusMonths = locacaoParams?.bonusMonths ?? 2;
  const contractMonths = locacaoParams?.contractMonths ?? 60;
  const commissionPercent = locacaoParams?.commissionPercent ?? 6;

  // Sales Agent Commission: customizable commissionPercent % of the Reference Price (discounted) scaled by quantity
  const basePrice = selectedOption === "venda" ? generator.vendaPrice : generator.locacaoRefPrice;
  const referencePrice = basePrice * quantity;
  const commission = referencePrice * discountFactor * (commissionPercent / 100);

  // Selected Option details
  let investment = 0;
  let clientPayment = 0;
  let paybackSimple = 0;

  if (selectedOption === "venda") {
    // Venda Direta
    // In Venda Direta / BNDES Investidor model, the investor invests the generator's purchase price (vendaPrice) plus the sales commission
    const baseInvestment = (generator.vendaPrice * quantity) * discountFactor;
    investment = baseInvestment + commission;
    
    // Client pays specified rentPercent (e.g. 50%) of the total generated parallel energy value to the investor
    clientPayment = monthlySavings * (rentPercent / 100);

    // Payback for investor: investment / client payment
    paybackSimple = clientPayment > 0 ? Math.round((investment / clientPayment) * 10) / 10 : 0;
  } else {
    // Locação Estruturada
    // Investment is the Reference Locação equipment price plus the sales commission
    const baseInvestment = (generator.locacaoRefPrice * quantity) * discountFactor;
    investment = baseInvestment + commission;

    // Client pays specified rentPercent (e.g. 50%) of total generated parallel energy value as leasing fee after the grace period
    clientPayment = monthlySavings * (rentPercent / 100);

    // Simple payback for investor (which in structured lease starts after fabrication):
    paybackSimple = clientPayment > 0 ? Math.round((investment / clientPayment) * 10) / 10 : 0;
  }

  // Grace Period: Payback Simple (or Client payback) + bonusMonths (only applicable for Locação)
  const gargantuaGracePeriod = selectedOption === "venda" ? 0 : Math.ceil(paybackSimple + bonusMonths);

  // The custom contract months lease starts ONLY after the grace period ends.
  // Month 0: -investment
  // Month 1 to gargantuaGracePeriod: 0 (Grace period with no lease fee)
  // Month gargantuaGracePeriod + 1 to gargantuaGracePeriod + contractMonths: clientPayment
  const cashFlows: number[] = [ -investment ];
  for (let m = 1; m <= gargantuaGracePeriod; m++) {
    cashFlows.push(0);
  }
  for (let m = 1; m <= contractMonths; m++) {
    cashFlows.push(clientPayment);
  }

  // Calculate NPV (VPL) at 12% annual rate (standard cost of capital)
  const vpl = calculateVPL(cashFlows, 0.12);
  const tir = calculateTIR(cashFlows);
  const roi = investment > 0 ? ((clientPayment * contractMonths) / investment) * 100 : 0;

  const totalRevenue60Months = clientPayment * contractMonths;
  const totalProfit60Months = totalRevenue60Months - investment;
  const ebitda = clientPayment * 12; // annualized EBITDA once fully operational

  // Sales Agent Commission is calculated at the beginning of the function and added to the total investment.

  // Simulate BNDES if params provided
  let bndesSimulation;
  if (bndesParams && selectedOption === "venda") {
    const loanAmount = investment - bndesParams.downPayment;
    bndesSimulation = simulateBndes(
      loanAmount,
      bndesParams.annualRate,
      bndesParams.termMonths,
      bndesParams.graceMonths
    );
  }

  return {
    investment,
    monthlySavings,
    clientPayment,
    paybackSimple,
    paybackDiscounted: Number((paybackSimple * 1.25).toFixed(1)), // simple estimation of discounted payback
    gargantuaGracePeriod,
    totalRevenue60Months,
    totalProfit60Months,
    vpl,
    tir,
    roi,
    ebitda,
    commission,
    bndesSimulation
  };
}
