// SWP calculation logic as a pure React-friendly function
export function calculateSWPPlan({
  initialInvestment, // ₹1,00,00,000
  annualReturnRate, // 12%
  holdingYears, // 1
  swpYears, // 10
  monthlySWPBase, // ₹10,000
  inflationRate, // 6%
  tdsRate, // 10%
  finalCapitalGainsTaxRate = 10, // 10% for equity, optional
}) {
  const monthlyRate = annualReturnRate / 12 / 100; // e.g., 1% per month
  const inflationDecimal = inflationRate / 100;
  const tdsDecimal = tdsRate / 100;

  const totalHoldingMonths = holdingYears * 12;
  const totalSWPMonths = swpYears * 12;

  let corpus = initialInvestment;
  let growthTable = [];
  let totalWithdrawn = 0;
  let totalTDS = 0;

  // 1️⃣ Holding Phase: Monthly Compounding
  for (let i = 0; i < totalHoldingMonths; i++) {
    corpus *= 1 + monthlyRate; // monthly compounding
    growthTable.push({
      month: i + 1,
      phase: "Holding",
      opening: corpus,
      swp: 0,
      tds: 0,
      netWithdrawal: 0,
      interest: corpus * monthlyRate,
      closing: corpus * (1 + monthlyRate),
    });
  }

  // 2️⃣ SWP Phase: Withdraw monthly, increase yearly by inflation
  for (let m = 0; m < totalSWPMonths; m++) {
    const currentYear = Math.floor(m / 12);
    const adjustedSWP =
      monthlySWPBase * Math.pow(1 + inflationDecimal, currentYear);
    const tds = adjustedSWP * tdsDecimal;
    const netWithdrawal = adjustedSWP - tds;

    const openingBalance = corpus;
    corpus = (corpus - adjustedSWP) * (1 + monthlyRate); // apply withdrawal and interest
    const interestEarned = openingBalance * monthlyRate;

    totalWithdrawn += adjustedSWP;
    totalTDS += tds;

    growthTable.push({
      month: totalHoldingMonths + m + 1,
      phase: "SWP",
      opening: openingBalance,
      swp: adjustedSWP,
      tds,
      netWithdrawal,
      interest: interestEarned,
      closing: corpus,
    });
  }

  // 3️⃣ Final Corpus Tax Calculation
  const gain = corpus - initialInvestment;
  const taxableGain = Math.max(gain - 100000, 0);
  const capitalGainsTax = taxableGain * (finalCapitalGainsTaxRate / 100);
  const finalCorpusAfterTax = corpus - capitalGainsTax;

  // 🧾 Summary
  const summary = {
    totalWithdrawn: parseFloat(totalWithdrawn.toFixed(2)),
    totalTDS: parseFloat(totalTDS.toFixed(2)),
    finalCorpusBeforeTax: parseFloat(corpus.toFixed(2)),
    capitalGain: parseFloat(gain.toFixed(2)),
    capitalGainsTax: parseFloat(capitalGainsTax.toFixed(2)),
    finalCorpusAfterTax: parseFloat(finalCorpusAfterTax.toFixed(2)),
  };

  return { summary, growthTable };
}
