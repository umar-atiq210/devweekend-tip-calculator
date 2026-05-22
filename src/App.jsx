import { useState, useEffect } from 'react';

function App() {
  // --- STATE MANAGEMENT ---
  //Using String so that when user write 'text' we can handle it
  const [bill, setBill] = useState('');
  const [tipPreset, setTipPreset] = useState(15); // Default 15%
  const [customTip, setCustomTip] = useState('');
  const [people, setPeople] = useState('1');
  
  // Errors state
  const [errors, setErrors] = useState({ bill: '', tip: '', people: '' });

  // --- CALCULATION LOGIC ---
  const billAmount = parseFloat(bill) || 0;
  const tipPercentage = customTip !== '' ? parseFloat(customTip) : (tipPreset || 0);
  const numPeople = parseInt(people, 10) || 0;

  let totalTip = 0;
  let grandTotal = 0;
  let perPerson = 0;

  if (billAmount > 0 && tipPercentage >= 0 && numPeople > 0) {
    totalTip = billAmount * (tipPercentage / 100);
    grandTotal = billAmount + totalTip;
    
    // THE ROUNDING POLICY: Math.ceil is used to round UP to the nearest cent.
    // Reason: A group should never underpay a restaurant due to missing fraction of a cent.
    perPerson = Math.ceil((grandTotal / numPeople) * 100) / 100; 
  }

  // --- HANDLERS WITH STRICT VALIDATION ---
  
  // Bill Handle: Limit to 10 characters (e.g., 9999999.99)
  const handleBillChange = (e) => {
    const val = e.target.value;
    if (val.length > 10) return; // 💡 FIX: Extremely large numbers blocked

    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setBill(val);
      setErrors(prev => ({ ...prev, bill: val === '0' ? 'Bill cannot be zero' : '' }));
    }
  };

  // Tip Preset Handle
  const handlePresetClick = (val) => {
    setTipPreset(val);
    setCustomTip(''); // Clear custom if preset clicked
    setErrors(prev => ({ ...prev, tip: '' }));
  };

  // Custom Tip Handle: Limit to 5 characters (e.g., 999.9)
  const handleCustomTipChange = (e) => {
    const val = e.target.value;
    if (val.length > 5) return; // 💡 FIX: Tip limited

    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setCustomTip(val);
      setTipPreset(null); // Clear preset if custom used
    }
  };

  // People Handle: Limit to 4 characters (max 9999 people)
  const handlePeopleChange = (e) => {
    const val = e.target.value;
    if (val.length > 4) return; // 💡 FIX: Absurd number of people blocked

    if (val === '' || /^\d+$/.test(val)) {
      setPeople(val);
      if (val === '0') {
        setErrors(prev => ({ ...prev, people: 'Can\'t be zero' }));
      } else {
        setErrors(prev => ({ ...prev, people: '' }));
      }
    }
  };


  // Reset Everything
  const handleReset = () => {
    setBill('');
    setTipPreset(15);
    setCustomTip('');
    setPeople('1');
    setErrors({ bill: '', tip: '', people: '' });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
      <main className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT PANEL - INPUTS */}
        <div className="p-8 md:w-1/2 space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-slate-700 mb-2 uppercase text-center md:text-left">Splitter</h1>
          </div>

          {/* Bill Input */}
          <div className="space-y-2 relative">
            <div className="flex justify-between items-end">
              <label htmlFor="bill" className="text-sm font-bold text-slate-500">Bill Amount</label>
              {errors.bill && <span className="text-sm font-bold text-red-500 animate-pulse">{errors.bill}</span>}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs</span>
              <input 
                id="bill"
                type="text" 
                inputMode="decimal"
                value={bill}
                onChange={handleBillChange}
                placeholder="0.00"
                className={`w-full bg-slate-50 text-slate-800 text-right text-2xl font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.bill ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-teal-500'}`}
                aria-invalid={!!errors.bill}
              />
            </div>
          </div>

          {/* Tip Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500">Select Tip %</label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {[5, 10, 15, 25, 50].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetClick(preset)}
                  className={`py-3 text-xl font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-300 ${tipPreset === preset ? 'bg-teal-600 text-white shadow-md transform scale-[1.02]' : 'bg-slate-800 text-white hover:bg-teal-500 hover:text-white'}`}
                >
                  {preset}%
                </button>
              ))}
              <input 
                type="text"
                inputMode="decimal"
                value={customTip}
                onChange={handleCustomTipChange}
                placeholder="Custom"
                className="bg-slate-50 text-slate-800 text-center text-xl font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-500 transition-all"
                aria-label="Custom tip percentage"
              />
            </div>
          </div>

          {/* Number of People */}
          <div className="space-y-2 relative">
            <div className="flex justify-between items-end">
              <label htmlFor="people" className="text-sm font-bold text-slate-500">Number of People</label>
              {errors.people && <span className="text-sm font-bold text-red-500 animate-pulse">{errors.people}</span>}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">👤</span>
              <input 
                id="people"
                type="text"
                inputMode="numeric"
                value={people}
                onChange={handlePeopleChange}
                placeholder="1"
                className={`w-full bg-slate-50 text-slate-800 text-right text-2xl font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.people ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-teal-500'}`}
                aria-invalid={!!errors.people}
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - RESULTS */}
        <div className="p-6 md:w-1/2">
          <div className="bg-slate-800 h-full rounded-2xl p-8 flex flex-col justify-between">
            <div className="space-y-8" aria-live="polite">
              
              {/* Tip Amount Result */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-white font-bold">Tip Amount</h2>
                  <p className="text-slate-400 text-sm">/ total</p>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-teal-400 break-all">
                  Rs. {totalTip.toFixed(2)}
                </div>
              </div>

              {/* Grand Total Result */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-white font-bold">Total Bill</h2>
                  <p className="text-slate-400 text-sm">incl. tip</p>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-teal-400 break-all">
                  Rs. {grandTotal.toFixed(2)}
                </div>
              </div>

              {/* Per Person Result */}
              <div className="flex justify-between items-center bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                <div>
                  <h2 className="text-white font-bold text-lg">Per Person</h2>
                  <p className="text-teal-200/60 text-sm">you owe</p>
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white break-all">
                  Rs. {perPerson.toFixed(2)}
                </div>
              </div>

            </div>

            {/* Reset Button */}
            <button 
              onClick={handleReset}
              disabled={!bill && !customTip && tipPreset === 15 && people === '1'}
              className="w-full mt-12 bg-teal-500 hover:bg-teal-400 disabled:opacity-20 disabled:hover:bg-teal-500 text-slate-900 font-bold text-xl py-3 rounded-lg uppercase tracking-wider transition-all focus:outline-none focus:ring-4 focus:ring-teal-300"
            >
              Reset
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;