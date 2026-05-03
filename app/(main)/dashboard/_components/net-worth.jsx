import { getAccountsWithTransactions } from "@/actions/getAccountsWithTransactions";
import { ChartAreaDefault } from "@/components/ChartAreaDefault";
import { ClientOnly } from "@/components/Clientonly";

export default async function NetWorthPage() {
  const accounts = await getAccountsWithTransactions();

  return (
    <div>
      <ClientOnly>
        <ChartAreaDefault accounts={accounts} />
      </ClientOnly>
    </div>
  );
}
