"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { PenBox, Activity, Home, BarChart3, Menu, X } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs"; // 👈 added useUser
import Image from "next/image";
import { ModeToggle } from "./ui/ModeToggle";

const HeaderClient = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [menuHeight, setMenuHeight] = useState(0);

  const { isSignedIn } = useUser(); // 👈 Clerk client hook

  // Dynamically calculate menu height for animation
  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest("button")
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // 👇 Ensure DB user is created on first sign-in
  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/check-user")
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ Synced Clerk user with DB:", data);
        })
        .catch((err) => {
          console.error("❌ Failed to sync user with DB:", err);
        });
    }
  }, [isSignedIn]);


  return (
    <header className="fixed top-0 w-full border-b border-border z-50 bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto flex flex-wrap items-center justify-between px-2 md:px-4 py-2 md:py-3">
        {/* Logo + Mode Toggle */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <Link href="/" className="flex items-center gap-1 md:gap-2">
            <Image
              src="/favicon-light.png"
              alt="Finfold Logo Light"
              width={32}
              height={32}
              className="h-8 w-8 object-contain dark:hidden"
            />
            <Image
              src="/favicon-dark.png"
              alt="Finfold Logo Dark"
              width={32}
              height={32}
              className="h-8 w-8 object-contain hidden dark:block"
            />
            <span className="text-lg md:text-xl font-bold text-foreground">
              Finfold
            </span>
          </Link>
          <ModeToggle />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <a href="#features" className="text-muted-foreground hover:text-primary transition">
              Features
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-primary transition">
              Testimonials
            </a>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <Home size={18} />
                <span>Home</span>
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button className="flex items-center gap-2 bg-sky-950 border-white">
                <PenBox size={18} />
                <span>Add</span>
              </Button>
            </Link>
            <Link href="/wealth">
              <Button className="flex items-center gap-2 bg-sky-950 border-white">
                <BarChart3 size={18} />
                <span>Wealth</span>
              </Button>
            </Link>
            <Link href="/swp">
              <Button className="flex items-center gap-2 bg-sky-950 border-white">
                <Activity size={18} />
                <span>SWP</span>
              </Button>
            </Link>
            <UserButton
              appearance={{ elements: { avatarBox: "w-10 h-10" } }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <SignedIn>
            <div className="w-full flex justify-center">
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            </div>
          </SignedIn>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Animated Mobile Menu */}
      <div
        ref={menuRef}
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: mobileMenuOpen ? `${menuHeight}px` : "0px" }}
      >
        <div className="bg-background border-t border-border w-full flex flex-col items-center gap-2 py-4">
          <SignedOut>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted-foreground hover:text-primary transition text-sm"
            >
              Features
            </a>

            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted-foreground hover:text-primary transition text-sm"
            >
              Testimonials
            </a>

            <SignInButton forceRedirectUrl="/dashboard">
              <Button
                variant="outline"
                className="w-28 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Button>
            </SignInButton>
          </SignedOut>


          <SignedIn>
            <div className="flex flex-col items-center gap-3">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-28 text-sm flex items-center gap-2">
                  <Home size={16} /> Home
                </Button>
              </Link>
              <Link href="/transaction/create" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-28 text-sm flex items-center gap-2 bg-sky-950 border-white">
                  <PenBox size={16} /> Add
                </Button>
              </Link>
              <Link href="/wealth" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-28 text-sm flex items-center gap-2 bg-sky-950 border-white">
                  <BarChart3 size={16} /> Wealth
                </Button>
              </Link>
              <Link href="/swp" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-28 text-sm flex items-center gap-2 bg-sky-950 border-white">
                  <Activity size={16} /> SWP
                </Button>
              </Link>
            </div>
          </SignedIn>


        </div>
      </div>
    </header>
  );
};

export default HeaderClient;
