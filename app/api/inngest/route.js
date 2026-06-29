// import { serve } from "inngest/next";
// import { inngest } from "@/lib/inngest/client";
// import {
//   checkBudgetAlerts,
//   //generateMonthlyReports,
//   processRecurringTransaction,
//   triggerRecurringTransactions,
// } from "@/lib/inngest/function";

// export const { GET, POST, PUT } = serve({
//   client: inngest,
//   functions: [
//     processRecurringTransaction,
//     triggerRecurringTransactions,
//    // generateMonthlyReports,
//     checkBudgetAlerts,
//   ],
// });
 
// import { serve } from "inngest/next";
// import { helloWorld } from "@/app/lib/inngest/functions";
// //import { Inngest } from "inngest";
// import { inngest } from "@/lib/inngest/client";

// // Create an API that serves zero functions
// export const { GET, POST, PUT } = serve({
//   client: inngest,
//   functions: [
//     helloWorld,/* your functions will be passed here later! */
//   ],
// });


import { inngest } from "@/lib/inngest/client";
import { checkBudgetAlerts, generateMonthlyReports, helloWorld, processRecurringTransaction, triggerRecurringTransactions, } from "@/lib/inngest/function";
import { serve } from "inngest/next";
// import { inngest } from "../../../inngest/client";
// import {  } from "@/app/lib/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    processRecurringTransaction,
    triggerRecurringTransactions,
    generateMonthlyReports,
    checkBudgetAlerts,/* your functions will be passed here later! */
  ],
});
