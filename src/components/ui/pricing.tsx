"use client";

import { buttonVariants } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

type Interval = 'monthly' | 'quarterly' | 'yearly';

interface PricingPlan {
  name: string;
  price: string; // monthly price (billed monthly)
  quarterlyPrice?: string; // monthly price when billed quarterly
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.",
}: PricingProps) {
  const [interval, setInterval] = useState<Interval>('monthly');
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const tabsRef = useRef<HTMLDivElement>(null);

  const celebrateAnnual = () => {
    if (tabsRef.current) {
      const rect = tabsRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          "hsl(var(--primary))",
          "hsl(var(--accent))",
          "hsl(var(--secondary))",
          "hsl(var(--muted))",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  return (
    <div className="container py-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg whitespace-pre-line">
          {description}
        </p>
      </div>

      <div ref={tabsRef} className="flex justify-center mb-10">
        <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white p-1">
          {(['monthly','quarterly','yearly'] as Interval[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setInterval(tab);
                if (tab === 'yearly') celebrateAnnual();
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${interval===tab ? 'bg-red-600 text-white' : 'text-zinc-700 hover:bg-zinc-50'}`}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 sm:2 gap-4">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 1 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -30 : index === 0 ? 30 : 0,
                    scale: index === 0 || index === 2 ? 0.94 : 1.0,
                  }
                : {}
            }
            viewport={{ once: true }}
            transition={{
              duration: 1.6,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: 0.4,
              opacity: { duration: 0.5 },
            }}
            className={cn(
              "rounded-2xl border p-6 text-center lg:flex lg:flex-col lg:justify-center relative flex flex-col shadow-sm",
              plan.isPopular
                ? "border-red-600 bg-red-600 text-white"
                : "border-zinc-200 bg-white",
              !plan.isPopular && "mt-5",
              index === 0 || index === 2
                ? "z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]"
                : "z-10",
              index === 0 && "origin-right bg-zinc-50",
              index === 2 && "origin-left bg-zinc-50"
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-white/15 py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
                <Star className="h-4 w-4 fill-current text-white" />
                <span className="ml-1 font-sans font-semibold text-white">Popular</span>
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <p className={cn("text-base font-semibold", plan.isPopular ? "text-white/90" : "text-zinc-500") }>
                {plan.name}
              </p>
              <div className="mt-6 flex items-center justify-center gap-x-2">
                <span className={cn("text-5xl font-bold tracking-tight", plan.isPopular ? "text-white" : "text-zinc-950") }>
                  <NumberFlow
                    value={
                      interval === 'monthly'
                        ? Number(plan.price)
                        : interval === 'quarterly'
                          ? Number(plan.quarterlyPrice ?? plan.price)
                          : Number(plan.yearlyPrice)
                    }
                    format={{ style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                    transformTiming={{ duration: 500, easing: "ease-out" }}
                    willChange
                    className="font-variant-numeric: tabular-nums"
                  />
                </span>
                {plan.period !== "Next 3 months" && (
                  <span className={cn("text-sm font-semibold leading-6 tracking-wide", plan.isPopular ? "text-white/80" : "text-zinc-500") }>
                    / {plan.period}
                  </span>
                )}
              </div>

              <p className={cn("text-xs leading-5", plan.isPopular ? "text-white/80" : "text-zinc-500") }>
                {interval === 'monthly' ? 'billed monthly' : interval === 'quarterly' ? 'billed quarterly' : 'billed annually'}
              </p>

              <ul className="mt-5 gap-2 flex flex-col">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className={cn("h-4 w-4 mt-1 flex-shrink-0", plan.isPopular ? "text-white" : "text-red-600") } />
                    <span className={cn("text-left", plan.isPopular ? "text-white" : "")}>{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className={cn("w-full my-4", plan.isPopular ? "border-white/30" : "border-zinc-200") } />

              <Link
                href={`/api/remember-plan?plan=${encodeURIComponent(plan.name.toLowerCase())}&interval=${interval}`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "btn-lg group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter transform-gpu ring-offset-current transition-all duration-300 ease-out",
                  plan.isPopular
                    ? "bg-white text-red-600 hover:bg-red-50 hover:text-red-700 hover:ring-2 hover:ring-red-300"
                    : "bg-background text-foreground hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:bg-primary hover:text-primary-foreground"
                )}
              >
                {plan.buttonText}
              </Link>
              <p className={cn("mt-6 text-xs leading-5", plan.isPopular ? "text-white/80" : "text-zinc-500") }>
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


