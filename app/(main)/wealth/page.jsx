"use client";

import { ClientOnly } from "@/components/Clientonly";
import WealthCalculator from "@/components/wealth-calculator/WealthCalculator";
import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default function DashboardPage() {
  return (
    <div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <ClientOnly>
          <WealthCalculator />
        </ClientOnly>
      </Suspense>
    </div>
  );
}
