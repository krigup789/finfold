import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

const formatINR = (num) => {
  return new Intl.NumberFormat("en-IN").format(num);
};

export async function POST(req) {
  const { message, userId } = await req.json();

  // 🔥 Fetch user data
  const accounts = await db.account.findMany({
    where: { userId },
    include: { transactions: true },
  });

  let netWorth = 0;
  let equity = 0;
  let debt = 0;

  accounts.forEach((acc) => {
    netWorth += Number(acc.balance || 0);

    if (acc.type === "STOCK" || acc.type === "MUTUAL_FUND") {
      equity += Number(acc.balance || 0);
    } else {
      debt += Number(acc.balance || 0);
    }
  });

  const equityRatio = netWorth > 0 ? equity / netWorth : 0;
  const debtRatio = netWorth > 0 ? debt / netWorth : 0;

  let actions = [];

  if (equityRatio < 0.3) {
    actions.push("Start SIP in equity mutual funds\n");
  }

  if (debtRatio > 0.6) {
    actions.push("Reduce FD allocation gradually\n");
  }

  let insights = [];
  const insightsText = insights.map((i) => `- ${i}`).join("\n");

  // 🔥 Equity Analysis
  if (equityRatio < 0.3) {
    insights.push("Equity is too low (<30%), growth will be slow\n");
  } else if (equityRatio > 0.7) {
    insights.push("Equity is too high (>70%), portfolio is risky\n");
  } else {
    insights.push("Equity allocation is balanced\n");
  }

  // 🔥 Debt Analysis
  if (debtRatio > 0.6) {
    insights.push("Too much allocation in debt, returns may be low\n");
  }

  // 🔥 SIP Detection
  // if (monthlyInvestment < 5000) {
  //   insights.push("Monthly investment is low, increase SIP");
  // }

  // 🔥 Account Check
  if (accounts.length > 5) {
    insights.push("Too many accounts, consider simplifying\n");
  }

  const portfolioSummary = `
  Net Worth: ₹${formatINR(netWorth)}
  Equity: ₹${formatINR(equity)}
  Debt: ₹${formatINR(debt)}
  Accounts: ${accounts.length}
  `;

  const system_prompt = `
  You are FinFold AI Advisor 💰

  User Portfolio:
  ${portfolioSummary}

  Detected Insights:
  ${insightsText}

  STRICT INSTRUCTIONS:

  - Answer in bullet points ONLY
  - Max 4 points
  - Each point must be based on insights
  - DO NOT give generic advice

  BEHAVIOR:

  - Identify biggest problem first
  - Give clear action (what to change)
  - Use numbers when possible

  EXAMPLES:

  BAD:
  "diversify portfolio"

  GOOD:
  "Equity is only 20%, increase to 50%"

  FOCUS:
  - Fix portfolio
  - Improve returns
  - Reduce risk
  `;

  // 🔥 OpenRouter API call
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // or try: "mistralai/mixtral-8x7b"
        messages: [
          { role: "system", content: system_prompt },
          { role: "user", content: message },
        ],
      }),
    }
  );

  const data = await response.json();

  return NextResponse.json({
    reply: data.choices?.[0]?.message?.content || "No response",
  });
}
