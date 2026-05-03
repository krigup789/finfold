import { checkUser } from "@/lib/checkUser";
import HeaderClient from "./HeaderClient";

export const dynamic = "force-dynamic";

const Header = async () => {
  // Run server-side user check
  const user = await checkUser();

  return (
    <HeaderClient user={user} />
  );
};

export default Header;
