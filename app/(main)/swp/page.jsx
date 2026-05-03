import { ClientOnly } from "@/components/Clientonly";
import SWPCalculator from "@/components/swp-calculator/SWPCalculator";

export default function DashboardPage() {
  return (
    <div>
      <ClientOnly>
        <SWPCalculator />
      </ClientOnly>
    </div>
  );
}
