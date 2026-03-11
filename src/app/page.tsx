"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import QuestionsPreview from "@/components/QuestionsPreview";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FounderNote from "@/components/FounderNote";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";
import AuthModal from "@/components/AuthModal";
import Reveal from "@/components/Reveal";

function LandingContent() {
  const [authOpen, setAuthOpen] = useState(false);
  const searchParams = useSearchParams();

  // Open modal if redirected from middleware with ?auth=1
  useEffect(() => {
    if (searchParams.get("auth") === "1") setAuthOpen(true);
  }, [searchParams]);

  return (
    <>
      <Nav onOpenAuth={() => setAuthOpen(true)} />
      <main>
        <Hero onOpenAuth={() => setAuthOpen(true)} />
        <Reveal><SocialProof /></Reveal>
        <Reveal><Problem /></Reveal>
        <Reveal><HowItWorks /></Reveal>
        <Reveal><Features /></Reveal>
        <Reveal><QuestionsPreview /></Reveal>
        <Reveal><Testimonials /></Reveal>
        <Reveal><Pricing onOpenAuth={() => setAuthOpen(true)} /></Reveal>
        <Reveal><FounderNote /></Reveal>
        <Reveal><Faq /></Reveal>
        <Reveal><FinalCta onOpenAuth={() => setAuthOpen(true)} /></Reveal>
      </main>
      <Footer />
      <StickyCta onOpenAuth={() => setAuthOpen(true)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default function LandingPage() {
  return (
    <Suspense>
      <LandingContent />
    </Suspense>
  );
}
