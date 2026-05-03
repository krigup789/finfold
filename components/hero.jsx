"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-[120px] pb-[80px] px-4 bg-background text-foreground">
      <div className="max-w-screen-xl mx-auto text-center">
        {/* Gradient Title */}
        <h1 className="gradient-title text-5xl md:text-7xl lg:text-[100px] leading-tight font-bold mb-6">
          Manage Your Investments <br className="hidden sm:block" />& Plan
          Financial Freedom
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          An AI-powered financial platform to track, analyze, and optimize your
          wealth with real-time insights.
        </p>

        {/* Animated Image */}
        <div className="hero-image-wrapper mt-10 md:mt-16">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/bannerimg.png"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-xl shadow-2xl border border-border mx-auto dark:hidden transition-transform duration-500 ease-in-out transform hover:scale-105 scrolled:scale-110"
              priority
            />
            <Image
              src="/bannerimg-lg.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-xl shadow-2xl border border-border mx-auto hidden dark:block transition-transform duration-500 ease-in-out transform hover:scale-105 scrolled:scale-110"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
