import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server"; // ✅ Server-safe import
import Greeting from "@/components/Greeting";

// Format date with day of the week
function formatDateWithDay(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = days[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];
  return `It's ${dayOfMonth} ${month}, A ${day}`;
}

export default async function Layout() {
  const user = await currentUser();

  return (
    <div className="px-5">
      <div className="mb-6">
        {/* Greeting */}
        <h1 className="text-base font-medium text-muted-foreground">
          {<Greeting />}, {user?.firstName || "User"}
        </h1>

        {/* Formatted Date */}
        <p className="text-lg text-muted-foreground">
          {formatDateWithDay(new Date())}
        </p>

        {/* Dashboard Title */}
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mt-4">
          Dashboard
        </h2>
      </div>

      {/* Suspense for async content */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
}
