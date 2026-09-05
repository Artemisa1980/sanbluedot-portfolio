export type CalculatorMode = 'compound' | 'savings' | 'loan' | 'credit-card';
export interface CalculatorInputs { principal: number; rate: number; years: number; monthly: number }
export interface ChartRow { year: number; primary: number; secondary: number }
export interface Calculation {
  amount: number;
  interest: number;
  contributed: number;
  rows: ChartRow[];
  payoffMonths?: number;
  warning?: string;
  paymentToReduce?: number;
}

export type AssetAction = 'repair' | 'upgrade' | 'replace';
export interface AssetScenarioInputs { cost: number; serviceYears: number; downtimeDays: number }
export interface AssetDecisionInputs {
  horizonYears: number;
  downtimeDailyCost: number;
  scenarios: Record<AssetAction, AssetScenarioInputs>;
}
export interface AssetDecisionRow { year: number; repair: number; upgrade: number; replace: number }
export interface AssetDecisionOption extends AssetScenarioInputs {
  id: AssetAction;
  actionCost: number;
  downtimeCost: number;
  annualizedCost: number;
  equivalentCost: number;
}
export interface AssetDecisionResult {
  options: AssetDecisionOption[];
  rows: AssetDecisionRow[];
  costLeader: AssetAction;
}

// UI validates finite, nonnegative inputs; years is a positive whole number.
// Internal amounts retain precision. Currency is rounded only for display.
export function calculate(mode: CalculatorMode, input: CalculatorInputs): Calculation {
  const { principal, rate, monthly } = input;
  // Mirror the UI bounds so a direct call cannot divide by zero or build an empty series.
  const years = Math.max(1, Math.floor(input.years));
  if (mode === 'compound') {
    const rows = Array.from({ length: years + 1 }, (_, year) => ({
      year, primary: principal * (1 + rate / 100) ** year, secondary: principal,
    }));
    const amount = rows[years].primary;
    return { amount, interest: amount - principal, contributed: principal, rows };
  }

  const months = years * 12;
  const monthlyRate = rate / 1200;
  if (mode === 'savings') {
    let balance = principal;
    const rows = [{ year: 0, primary: principal, secondary: principal }];
    for (let month = 1; month <= months; month++) {
      balance = balance * (1 + monthlyRate) + monthly;
      if (month % 12 === 0) rows.push({ year: month / 12, primary: balance, secondary: principal + monthly * month });
    }
    const contributed = principal + monthly * months;
    return { amount: balance, interest: Math.max(0, balance - contributed), contributed, rows };
  }

  if (mode === 'credit-card') {
    // Educational estimate: daily compounding expressed as one average monthly
    // factor, then one fixed payment at the end of each modeled month.
    const dailyRate = rate / 36500;
    const cardMonthlyRate = Math.expm1((365 / 12) * Math.log1p(dailyRate));
    const firstInterest = principal * cardMonthlyRate;
    const paymentToReduce = firstInterest + 0.01;
    if (monthly <= firstInterest) {
      return {
        amount: 0,
        interest: 0,
        contributed: 0,
        rows: [{ year: 0, primary: principal, secondary: 0 }],
        warning: 'This payment does not cover the first modeled period of interest, so the balance will not decrease.',
        paymentToReduce,
      };
    }
    const payoffMonths = cardMonthlyRate === 0
      ? Math.ceil(principal / monthly)
      : Math.ceil(-Math.log1p(-principal * cardMonthlyRate / monthly) / Math.log1p(cardMonthlyRate));
    if (!Number.isFinite(payoffMonths) || payoffMonths > 600) {
      return {
        amount: 0,
        interest: 0,
        contributed: 0,
        rows: [{ year: 0, primary: principal, secondary: 0 }],
        warning: 'At this payment, the modeled payoff takes more than 50 years. Increase the payment to make the estimate useful.',
        paymentToReduce,
      };
    }
    let balance = principal;
    let interest = 0;
    let totalPaid = 0;
    const rows = [{ year: 0, primary: principal, secondary: 0 }];
    for (let month = 1; month <= payoffMonths; month++) {
      const periodInterest = balance * cardMonthlyRate;
      interest += periodInterest;
      const paid = Math.min(monthly, balance + periodInterest);
      totalPaid += paid;
      balance = Math.max(0, balance + periodInterest - paid);
      if (month === payoffMonths) balance = 0;
      if (month % 12 === 0 || month === payoffMonths) rows.push({ year: month / 12, primary: balance, secondary: interest });
    }
    return { amount: totalPaid, interest, contributed: totalPaid, rows, payoffMonths, paymentToReduce };
  }

  // expm1/log1p avoid cancellation for small positive rates; zero is exact.
  const payment = monthlyRate === 0 ? principal / months
    : principal * monthlyRate / -Math.expm1(-months * Math.log1p(monthlyRate));
  let balance = principal;
  const rows = [{ year: 0, primary: principal, secondary: 0 }];
  for (let month = 1; month <= months; month++) {
    balance = Math.max(0, balance * (1 + monthlyRate) - payment);
    if (month === months) balance = 0;
    if (month % 12 === 0) rows.push({ year: month / 12, primary: balance, secondary: principal - balance });
  }
  return { amount: payment, interest: Math.max(0, payment * months - principal), contributed: payment * months, rows };
}

export function calculateAssetDecision(input: AssetDecisionInputs): AssetDecisionResult {
  const actions: AssetAction[] = ['repair', 'upgrade', 'replace'];
  // Mirror the UI bounds so a direct call cannot divide by zero or build an empty series.
  const horizonYears = Math.max(1, Math.floor(input.horizonYears));
  const options = actions.map(id => {
    const scenario = input.scenarios[id];
    const serviceYears = Math.max(0.5, scenario.serviceYears);
    const downtimeCost = scenario.downtimeDays * input.downtimeDailyCost;
    const actionCost = scenario.cost + downtimeCost;
    const annualizedCost = actionCost / serviceYears;
    return {
      id,
      ...scenario,
      serviceYears,
      actionCost,
      downtimeCost,
      annualizedCost,
      equivalentCost: annualizedCost * horizonYears,
    };
  });
  const costLeader = options.reduce((lowest, option) =>
    option.equivalentCost < lowest.equivalentCost ? option : lowest
  ).id;
  const annual = Object.fromEntries(options.map(option => [option.id, option.annualizedCost])) as Record<AssetAction, number>;
  const rows = Array.from({ length: horizonYears + 1 }, (_, year) => ({
    year,
    repair: annual.repair * year,
    upgrade: annual.upgrade * year,
    replace: annual.replace * year,
  }));
  return { options, rows, costLeader };
}

// Remove binary noise below the displayed cents (e.g. 5671.124999999999).
export const money = (value: number) => Number(value.toPrecision(15)).toLocaleString('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2,
});
