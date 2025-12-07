import React, { useState } from 'react';
import { ArrowRightLeft, Loader2, Coins, TrendingUp, Info } from 'lucide-react';
import { CURRENCIES, DEFAULT_SOURCE_CURRENCY, DEFAULT_TARGET_CURRENCY } from './constants';
import { convertCurrency } from './services/geminiService';
import { ConversionResult, Currency } from './types';
import HistoryChart from './components/HistoryChart';

const App: React.FC = () => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<Currency>(DEFAULT_SOURCE_CURRENCY);
  const [toCurrency, setToCurrency] = useState<Currency>(DEFAULT_TARGET_CURRENCY);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    // Reset result on swap to avoid confusion, or trigger re-convert if needed
    setResult(null);
  };

  const handleConvert = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await convertCurrency(numAmount, fromCurrency.code, toCurrency.code);
      setResult(data);
    } catch (err) {
      setError("Failed to fetch conversion rates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-blue-600 rounded-full p-3 inline-block shadow-lg mb-4">
          <Coins className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Gemini Currency Converter
        </h1>
        <p className="mt-2 text-slate-600">
          Real-time AI-powered conversions & trends
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8">
          
          {/* Amount Input */}
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                $
              </span>
              <input
                type="number"
                id="amount"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg font-medium text-slate-900 placeholder-slate-400"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Currency Selectors */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                From
              </label>
              <div className="relative">
                <select
                  value={fromCurrency.code}
                  onChange={(e) => {
                    const c = CURRENCIES.find(c => c.code === e.target.value);
                    if (c) setFromCurrency(c);
                  }}
                  className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 py-3 pl-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} - {c.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSwap}
              className="mt-6 p-2 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Swap Currencies"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </button>

            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                To
              </label>
              <div className="relative">
                <select
                  value={toCurrency.code}
                  onChange={(e) => {
                    const c = CURRENCIES.find(c => c.code === e.target.value);
                    if (c) setToCurrency(c);
                  }}
                  className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 py-3 pl-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} - {c.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConvert}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                Convert Now
                <ArrowRightLeft className="h-4 w-4" />
              </>
            )}
          </button>
          
          {error && (
             <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3">
                <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
             </div>
          )}

          {/* Result Section */}
          {result && !loading && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-sm font-medium text-slate-500 mb-1">
                  {parseFloat(amount).toLocaleString()} {fromCurrency.name} =
                </p>
                <div className="flex items-baseline justify-center gap-2 flex-wrap">
                   <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-900 tracking-tight">
                    {result.convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                  <span className="text-xl sm:text-2xl font-bold text-blue-700">
                    {result.currencyCode}
                  </span>
                </div>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
                   <TrendingUp className="h-4 w-4" />
                   <span>1 {fromCurrency.code} = {result.conversionRate.toFixed(4)} {toCurrency.code}</span>
                </div>
              </div>

              {/* Chart */}
              <HistoryChart 
                data={result.historicalRates} 
                fromCode={fromCurrency.code} 
                toCode={toCurrency.code} 
              />
              
              <p className="text-center text-xs text-slate-400 mt-6">
                Exchange rates provided by AI estimation. Not for trading purposes.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default App;
