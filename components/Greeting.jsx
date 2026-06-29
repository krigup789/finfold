"use client";
import { useEffect, useState } from "react";

// Helper function: decide greeting based on local hour
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 16) return "Good Afternoon";
  if (hour < 20) return "Good Evening";
  return "Good Night";
}

// Component that shows greeting
export default function Greeting() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setGreeting(getGreeting()); // ✅ Runs in browser, respects local time
  }, []);

  return <span>{greeting}</span>;
}
