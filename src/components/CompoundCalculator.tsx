import { useState } from 'react';
import AssetDecisionChart from './AssetDecisionChart';
import CalculatorChart from './CalculatorChart';
import DeskTabs from './DeskTabs';
import {
  calculate,
  calculateAssetDecision,
  money,
  type AssetAction,
  type AssetDecisionInputs,
  type CalculatorInputs,
  type CalculatorMode,
} from '../financialModels';

type CalculatorView = CalculatorMode | 'asset';

const tabs: readonly { id: CalculatorView; label: string }[] = [
  { id: 'compound', label: 'Compound' },
  { id: 'savings', label: 'Savings' },
  { id: 'loan', label: 'Loan' },
  { id: 'credit-card', label: 'Credit Card' },
  { id: 'asset', label: 'R / U / R' },
];

const assetTabs: readonly { id: AssetAction; label: string }[] = [
  { id: 'repair', label: 'Repair' },
  { id: 'upgrade', label: 'Upgrade' },
  { id: 'replace', label: 'Replace' },
];

const initial: Record<CalculatorMode, CalculatorInputs> = {
  compound: { principal: 5000, rate: 6.5, years: 5, monthly: 0 },
  savings: { principal: 1000, rate: 5, years: 5, monthly: 150 },
  loan: { principal: 10000, rate: 7, years: 3, monthly: 0 },
  'credit-card': { principal: 5000, rate: 24.99, years: 1, monthly: 150 },
};

// A factory, not a constant: state and Reset each need their own nested copy.
const freshAsset = (): AssetDecisionInputs => ({
  horizonYears: 5,
  downtimeDailyCost: 150,
  scenarios: {
    repair: { cost: 1600, serviceYears: 1.5, downtimeDays: 4 },
    upgrade: { cost: 3400, serviceYears: 4, downtimeDays: 8 },
    replace: { cost: 8900, serviceYears: 7, downtimeDays: 12 },
  },
});

const assetCopy: Record<AssetAction, { code: string; prompt: string }> = {
  repair: { code: '01', prompt: 'KEEP ASSET IN USE' },
  upgrade: { code: '02', prompt: 'REUSE REMOVED PARTS' },
  replace: { code: '03', prompt: 'PLAN OLD-ASSET RECOVERY' },
};

function NumberField({ id, label, value, min, max, step, integer, onChange }: {
  id: string; label: string; value: number; min: number; max: number; step: number; integer?: boolean; onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  const [lastValue, setLastValue] = useState(value);
  if (lastValue !== value) { setLastValue(value); setDraft(String(value)); }
  const number = Number(draft);
  const valid = draft.trim() !== '' && Number.isFinite(number) && number >= min && number <= max && (!integer || Number.isInteger(number));
  return <div className="desk-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} type="number" min={min} max={max} step={integer ? 1 : 'any'} value={draft}
      aria-invalid={!valid} aria-describedby={!valid ? `${id}-error` : undefined}
      onChange={event => {
        const text = event.target.value;
        setDraft(text);
        const next = Number(text);
        if (text !== '' && Number.isFinite(next) && next >= min && next <= max && (!integer || Number.isInteger(next))) onChange(next);
      }}
      onBlur={() => {
        const next = draft.trim() === '' || !Number.isFinite(number) ? value : Math.min(max, Math.max(min, integer ? Math.round(number) : number));
        setDraft(String(next)); onChange(next);
      }} />
    <input type="range" min={min} max={max} step={step} value={value} aria-label={`${label} slider`}
      onChange={event => { const next = Number(event.target.value); setDraft(String(next)); onChange(next); }} />
    {!valid && <small id={`${id}-error`}>Use {integer ? 'a whole number' : 'a number'} from {min.toLocaleString('en-US')} to {max.toLocaleString('en-US')}. Results keep the last valid value.</small>}
  </div>;
}

export default function CompoundCalculator() {
  const [mode, setMode] = useState<CalculatorView>('compound');
  const [inputs, setInputs] = useState(initial);
  const [assetInputs, setAssetInputs] = useState(freshAsset);
  const [assetMode, setAssetMode] = useState<AssetAction>('upgrade');
  const financeMode: CalculatorMode = mode === 'asset' ? 'compound' : mode;
  const value = inputs[financeMode];
  const result = calculate(financeMode, value);
  const assetResult = calculateAssetDecision(assetInputs);
  const leader = assetResult.options.find(option => option.id === assetResult.costLeader) ?? assetResult.options[0];
  const set = (key: keyof CalculatorInputs, next: number) => setInputs(current => ({ ...current, [financeMode]: { ...current[financeMode], [key]: next } }));
  const reset = () => setInputs(current => ({ ...current, [financeMode]: { ...initial[financeMode] } }));
  const setAssetShared = (key: 'horizonYears' | 'downtimeDailyCost', next: number) => setAssetInputs(current => ({ ...current, [key]: next }));
  const setAssetScenario = (key: 'cost' | 'serviceYears' | 'downtimeDays', next: number) => setAssetInputs(current => ({
    ...current,
    scenarios: { ...current.scenarios, [assetMode]: { ...current.scenarios[assetMode], [key]: next } },
  }));
  const loan = financeMode === 'loan';
  const card = financeMode === 'credit-card';
  const payoffTime = result.payoffMonths === undefined ? '' : [
    Math.floor(result.payoffMonths / 12) ? `${Math.floor(result.payoffMonths / 12)}Y` : '',
    result.payoffMonths % 12 ? `${result.payoffMonths % 12}M` : '',
  ].filter(Boolean).join(' ');

  return <div className="desk-workbench">
    <div className="desk-heading desk-heading--calculator">
      <h3>{mode === 'asset' ? 'Asset Decision Lab' : 'BBA Finance Lab'}</h3>
      <span className="desk-eyebrow">UTEL · 2029</span>
    </div>
    <DeskTabs id="calculator" label="Calculator type" items={tabs} value={mode} onChange={setMode} />
    {tabs.map(tab => <div key={tab.id} id={`calculator-panel-${tab.id}`} role="tabpanel" aria-labelledby={`calculator-tab-${tab.id}`} hidden={mode !== tab.id}>
      {mode === tab.id && (mode === 'asset' ? <>
        <div className="desk-asset-intro">
          <div><span>WORK ORDER · COST SCREEN</span><strong>Repair, upgrade, or replace?</strong></div>
          <p>Enter your own assumptions, then compare the modeled cost with the service and material checks.</p>
        </div>

        <div className="desk-fields desk-fields--asset-shared">
          <NumberField id="asset-horizon" label="Planning horizon · years" value={assetInputs.horizonYears} min={1} max={10} step={1} integer onChange={next => setAssetShared('horizonYears', next)} />
          <NumberField id="asset-downtime-cost" label="Downtime value · USD / day" value={assetInputs.downtimeDailyCost} min={0} max={5000} step={25} onChange={next => setAssetShared('downtimeDailyCost', next)} />
        </div>

        <section className="desk-asset-editor" aria-labelledby="asset-editor-title">
          <div className="desk-asset-editor__heading">
            <div><span>EDIT SCENARIO</span><strong id="asset-editor-title">{assetCopy[assetMode].code} · {assetMode.toUpperCase()}</strong></div>
            <span>{assetCopy[assetMode].prompt}</span>
          </div>
          <DeskTabs id="asset-action" label="Asset action" items={assetTabs} value={assetMode} onChange={setAssetMode} />
          {assetTabs.map(action => <div key={action.id} id={`asset-action-panel-${action.id}`} role="tabpanel" aria-labelledby={`asset-action-tab-${action.id}`} hidden={assetMode !== action.id}>
            {assetMode === action.id && <div className="desk-fields desk-fields--asset">
              <NumberField id={`${assetMode}-cost`} label={`${assetMode} cost · USD`} value={assetInputs.scenarios[assetMode].cost} min={0} max={100000} step={100} onChange={next => setAssetScenario('cost', next)} />
              <NumberField id={`${assetMode}-life`} label="Useful life · years" value={assetInputs.scenarios[assetMode].serviceYears} min={0.5} max={20} step={0.5} onChange={next => setAssetScenario('serviceYears', next)} />
              <NumberField id={`${assetMode}-downtime`} label="Downtime · days" value={assetInputs.scenarios[assetMode].downtimeDays} min={0} max={180} step={1} integer onChange={next => setAssetScenario('downtimeDays', next)} />
            </div>}
          </div>)}
        </section>

        <div className="desk-asset-leader" aria-label="Asset comparison result" aria-live="polite" aria-atomic="true">
          <div><span>LOWEST MODELED COST</span><strong>{leader.id.toUpperCase()}</strong></div>
          <div><span>{assetInputs.horizonYears}-YEAR EQUIVALENT</span><b>{money(leader.equivalentCost)}</b></div>
          <p>Cost result only · check downtime and material route.</p>
        </div>

        <div className="desk-asset-checks" aria-label="Repair, upgrade and replace comparison">
          {assetResult.options.map(option => <button key={option.id} type="button" className={option.id === assetResult.costLeader ? 'is-leader' : ''} onClick={() => setAssetMode(option.id)}>
            <span><i>{assetCopy[option.id].code}</i>{option.id.toUpperCase()}</span>
            <strong>{money(option.equivalentCost)}</strong>
            <small>{option.downtimeDays} service days · {assetCopy[option.id].prompt}</small>
          </button>)}
        </div>

        <div className="desk-total">Editable example assumptions<button type="button" onClick={() => setAssetInputs(freshAsset())}>Reset</button></div>
        <AssetDecisionChart key={`${assetInputs.horizonYears}-${assetInputs.downtimeDailyCost}`} rows={assetResult.rows} />
        <p className="desk-assumptions">Straight-line equivalent comparison: (action cost + modeled downtime cost) ÷ useful life × planning horizon. Excludes operating costs, energy, financing, inflation, discounting, residual value, taxes and future interventions. Material routes are decision prompts and are not monetized. <a href="https://bsesc.energy.gov/training-modules/life-cycle-analysis" target="_blank" rel="noreferrer">Life-cycle analysis context ↗</a> Educational scenario, not a recommendation.</p>
      </> : <>
        <div className={`desk-fields${mode === 'savings' ? ' desk-fields--four' : ''}`}>
          <NumberField id={`${mode}-principal`} label={card ? 'Card balance · USD' : loan ? 'Loan amount · USD' : 'Start amount · USD'} value={value.principal} min={loan || card ? 100 : 0} max={100000} step={100} onChange={next => set('principal', next)} />
          {mode === 'savings' && <NumberField id="savings-monthly" label="Monthly deposit · USD" value={value.monthly} min={0} max={5000} step={25} onChange={next => set('monthly', next)} />}
          <NumberField id={`${mode}-rate`} label={card ? 'Card APR · %' : 'Annual rate · %'} value={value.rate} min={0} max={card ? 40 : loan ? 30 : 20} step={0.1} onChange={next => set('rate', next)} />
          {card
            ? <NumberField id="credit-card-monthly" label="Monthly payment · USD" value={value.monthly} min={25} max={5000} step={25} onChange={next => set('monthly', next)} />
            : <NumberField id={`${mode}-years`} label="Duration · years" value={value.years} min={1} max={30} step={1} integer onChange={next => set('years', next)} />}
        </div>

        {result.warning ? <>
          <div className="desk-card-warning" role="status">
            <span>⚠ PAYMENT ALERT</span><strong>{result.warning}</strong>
            <p>Try more than {money(result.paymentToReduce ?? 0)} per month to begin reducing this modeled balance.</p>
          </div>
          <div className="desk-total"><button type="button" onClick={reset}>Restore example</button></div>
        </> : <>
          <div className="desk-result" aria-label="Calculation results" aria-live="polite" aria-atomic="true">
            <div><span>{card ? 'ESTIMATED PAYOFF TIME' : loan ? 'MONTHLY PAYMENT' : 'FUTURE BALANCE'}</span><strong>{card ? payoffTime : money(result.amount)}</strong></div>
            <div><span>{loan || card ? 'TOTAL INTEREST' : 'INTEREST EARNED'}</span><b>{money(result.interest)}</b></div>
          </div>
          <div className="desk-total">{loan || card ? 'Total paid' : 'Your contributions'} <b>{money(result.contributed)}</b><button type="button" onClick={reset}>Reset</button></div>
          <CalculatorChart key={mode} rows={result.rows} labels={card ? ['Balance left', 'Interest paid'] : loan ? ['Balance left', 'Principal paid'] : ['Total balance', 'Contributions']} />
        </>}

        <p className="desk-assumptions">{card ? <>
          Fixed APR and payment; no new charges, fees, grace period or promotional rates. Uses APR/365 with an average monthly period; your issuer may use daily balances and different rates. <a href="https://www.consumerfinance.gov/ask-cfpb/how-does-my-credit-card-company-calculate-the-amount-of-interest-i-owe-en-51/" target="_blank" rel="noreferrer">How card interest works ↗</a>
        </> : loan ? 'Fixed nominal annual rate; monthly payments. No fees, insurance or taxes. Calculated before rounding.' : mode === 'savings' ? 'Nominal annual rate, compounded monthly. Deposits at month-end. No taxes, fees or inflation.' : 'Annual compounding; no additional deposits, taxes, fees or inflation.'} Educational estimate, not a guarantee.</p>
      </>)}
    </div>)}
  </div>;
}
