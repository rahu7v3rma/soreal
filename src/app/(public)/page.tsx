/// <reference types="node" />
"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SorealLogo } from "@/components/ui/logo";
import {
  BLUR_DATA_URL,
  IMAGE_URLS,
} from "@/constants/landing-page";
import { modes } from "@/constants/ui/model-grid";
import { shuffle } from "@/lib/utils/common";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "./page.css";
import Link from "next/link";
import { Megaphone, Box, ShoppingBag, Lightbulb } from "lucide-react";

// Declare Calendly type to avoid TypeScript errors
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const images = shuffle(IMAGE_URLS);

const Page = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const calendlyScriptRef = useRef<HTMLScriptElement | null>(null);
  const calendlyStyleRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    if (images.length === 0) return;

    const startTransition = () => {
      setIsTransitioning(true);

      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % images.length);
      }, 2000);
    };

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(startTransition, 6000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [images, currentIndex, nextIndex, isTransitioning]);



  useEffect(() => {
    if (
      !document.querySelector(
        'link[href*="calendly.com/assets/external/widget.css"]'
      ) &&
      !calendlyStyleRef.current
    ) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
      calendlyStyleRef.current = link;
    }

    if (
      !document.querySelector(
        'script[src*="calendly.com/assets/external/widget.js"]'
      ) &&
      !calendlyScriptRef.current
    ) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
      calendlyScriptRef.current = script;
    }

    return () => {
      if (calendlyScriptRef.current) {
        calendlyScriptRef.current.remove();
        calendlyScriptRef.current = null;
      }
      if (calendlyStyleRef.current) {
        calendlyStyleRef.current.remove();
        calendlyStyleRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-screen">
      <main>
        <section className="relative min-h-screen h-[100vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-black/25 z-10 pointer-events-none" />

            <div className="absolute inset-0 z-0">
              <Image
                src={images[currentIndex]}
                alt="Hero background"
                fill
                className="object-cover"
                priority
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="100vw"
              />
            </div>

            <AnimatePresence>
              {isTransitioning && (
                <motion.div
                  className="absolute inset-0 z-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src={images[nextIndex]}
                    alt="Hero background"
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    sizes="100vw"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute inset-0 bg-black/25 z-20 pointer-events-none"></div>

          <div className="container relative z-30">
            <div className="flex flex-col items-start text-left pl-6 md:pl-12 lg:pl-24">
              <motion.h1
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.2
                }}
                className="text-[80px] sm:text-[96px] md:text-[112px] leading-[1.1] font-semibold tracking-[-0.022em] mb-8 text-white hero-title text-shadow-lg"
                style={{
                  filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15))",
                }}
              >
                AI Built for Realism
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.6
                }}
                className="text-xl sm:text-1xl md:text-2xl font-light hero-subheadline w-full whitespace-pre-line md:whitespace-nowrap"
                style={{
                  filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15))",
                }}
              >
                <span className="block md:inline">Stock photos slow you down.</span> <span className="block md:inline">Soreal creates photorealistic visuals in seconds.</span>
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 1.0
                }}
                className="mt-8"
              >
                <Button
                  className="h-14 px-8 text-lg bg-[#2fceb9] text-white hover:bg-[#26a594] rounded-lg transition-all duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.Calendly) {
                      window.Calendly.initPopupWidget({
                        url: "https://calendly.com/team-soreal",
                      });
                    }
                  }}
                >
                  Schedule Demo
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 1.2
                }}
                className="mt-10 flex items-center gap-4"
              >
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop",
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=48&h=48&fit=crop",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop"
                  ].map((src, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 1.4 + (index * 0.1),
                        ease: "easeOut"
                      }}
                    >
                      <Image
                        src={src}
                        alt="User"
                        className="w-7 h-7 rounded-full border-2 border-white"
                        width={28}
                        height={28}
                      />
                    </motion.div>
                  ))}
                </div>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.7,
                    ease: "easeOut"
                  }}
                  className="text-base text-white trusted-by-text"
                >
                  Trusted by creative teams worldwide.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="h-12"></div>

        <section className="py-20 bg-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)]">
          <div className="max-w-7xl mx-auto px-10 lg:px-20 space-y-8">
            <h2 className="text-center text-[48px] leading-[1.1] font-semibold tracking-[-0.022em]">
              Say Goodbye to Slow Creative Cycles
            </h2>
            <p className="text-center text-2xl text-gray-600 font-light leading-[1.2] mt-0 mb-0 max-w-4xl mx-auto">
              Soreal is trained on billions of images to understand light,
              texture, and realism, delivering content that looks like it was
              captured by a camera, not generated by AI.
            </p>
            <div className="flex flex-col gap-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true }}
                className="w-full px-10 py-12 rounded-3xl backdrop-blur-sm bg-white/60 shadow-md shadow-muted/30 border border-[#2fceb9]/30"
              >
                <div className="flex flex-col gap-10">
                  <div className="space-y-6 text-center mx-auto max-w-2xl">
                    <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight">
                      Instant Visuals, Studio Quality
                    </h3>
                    <p className="text-base text-muted-foreground">
                      Generate 4 megapixel images in just 10 seconds. That's
                      more than 2.5 times faster than other alternatives.
                    </p>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto items-center">
                    {/* Left Column - Text */}
                    <div className="flex-1 space-y-6">
                      <div className="space-y-4">
                        <h5 className="text-2xl lg:text-3xl font-semibold tracking-tight">
                          Soreal delivers studio-quality results in seconds
                        </h5>
                        <p className="text-lg text-gray-600 leading-relaxed">
                          Our advanced AI model understands lighting, texture, and composition
                          to create images that look professionally captured, not AI-generated.
                        </p>
                        <div className="space-y-4 pt-2">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-[#2fceb9] rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-base text-gray-700 leading-relaxed">
                              <span className="font-semibold">Photorealistic detail:</span> Every pixel is crafted with precision, from natural skin textures to authentic lighting that mimics real photography.
                            </p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-[#2fceb9] rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-base text-gray-700 leading-relaxed">
                              <span className="font-semibold">Lightning-fast generation:</span> What takes traditional photography hours or days, Soreal accomplishes in under 10 seconds with consistent, professional results.
                            </p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-[#2fceb9] rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-base text-gray-700 leading-relaxed">
                              <span className="font-semibold">No more stock photo limitations:</span> Create exactly what you envision without settling for generic imagery that doesn't match your brand.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Video */}
                    <div className="flex-1 max-w-lg">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="rounded-xl overflow-hidden shadow-md border border-[#2fceb9]/30 backdrop-blur-sm bg-white/60"
                      >
                        <div className="bg-gray-100 aspect-square relative overflow-hidden">
                          <video
                            src="https://api.soreal.app/assets/mov/landing-page/Soreal_Comparison.mov"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 inset-x-0 flex justify-center">
                            <div className="bg-white/80 px-2 py-1 rounded-md">
                              <SorealLogo className="h-6" />
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#dcf7f3] p-3 text-sm text-center font-medium">
                          10s average render
                        </div>
                        <div className="p-4 text-center space-y-2 border-t border-[#dcf7f3]">
                          <h4 className="text-sm font-bold text-gray-800">
                            Prompt
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            "Generate a high-resolution, photorealistic portrait of a
                            person in natural lighting, with sharp facial detail,
                            soft depth of field, and realistic skin texture."
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                  viewport={{ once: true }}
                  className="px-10 py-12 rounded-3xl backdrop-blur-sm bg-white/60 shadow-md shadow-muted/30 border border-[#2fceb9]/30 space-y-6"
                >
                  <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight">
                    Cut Production Costs
                  </h3>
                  <p className="text-base text-muted-foreground">
                    Replace expensive production with $0.01 image generation.
                  </p>

                  <div className="space-y-6 mt-6">
                    {[
                      { label: "Photoshoot", price: "$300+", width: "100%", color: "bg-[#1a8a7a]" },
                      { label: "Stock", price: "$50–150", width: "40%", color: "bg-[#26a594]" },
                      { label: "Editing", price: "$25–75", width: "20%", color: "bg-[#2fceb9]" },
                      { label: "Soreal Premium Mode", price: "$0.10", width: "0.5%", color: "bg-[#6dded0]" },
                      { label: "Soreal Standard Mode", price: "$0.01", width: "0.1%", color: "bg-[#a9ebe3]" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        viewport={{ once: true }}
                      >
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{item.label}</span>
                          <span className="text-sm font-medium">{item.price}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            className={`${item.color} h-2.5 rounded-full`}
                            initial={{ width: 0 }}
                            whileInView={{ width: item.width }}
                            transition={{ duration: 0.8, delay: 0.2 * index }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
                  viewport={{ once: true }}
                  className="px-10 py-12 rounded-3xl backdrop-blur-sm bg-white/60 shadow-md shadow-muted/30 border border-[#2fceb9]/30 space-y-6"
                >
                  <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight">
                    From Weeks to Minutes
                  </h3>
                  <p className="text-base text-muted-foreground">
                    Go from idea to asset in less than an hour.
                  </p>

                  <div className="space-y-8 mt-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-3">
                        BEFORE SOREAL (7 DAYS)
                      </h4>
                      <div className="relative bg-gray-50 p-4 rounded-xl">
                        <motion.div
                          className="h-1.5 bg-gray-300 rounded-full absolute top-8 left-4 right-4"
                          initial={{ width: 0 }}
                          whileInView={{ width: "calc(100% - 2rem)" }}
                          transition={{ duration: 0.8 }}
                          viewport={{ once: true }}
                        ></motion.div>
                        <div className="flex justify-between relative px-4">
                          {["Shoot", "Retouch", "Approve", "Publish"].map(
                            (step, index) => (
                              <motion.div
                                key={index}
                                className="flex flex-col items-center"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.2 * (index + 1) }}
                                viewport={{ once: true }}
                              >
                                <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center z-10 shadow-sm">
                                  <span className="text-white text-xs font-medium">
                                    {index + 1}
                                  </span>
                                </div>
                                <span className="text-xs mt-3 font-medium">
                                  {step}
                                </span>
                              </motion.div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-[#2fceb9] mb-3">
                        WITH SOREAL (UNDER 1 HOUR)
                      </h4>
                      <div className="relative bg-[#f0fbf9] p-4 rounded-xl">
                        <motion.div
                          className="h-1.5 bg-[#2fceb9] rounded-full absolute top-8 left-4 right-4"
                          initial={{ width: 0 }}
                          whileInView={{ width: "calc(100% - 2rem)" }}
                          transition={{ duration: 0.8 }}
                          viewport={{ once: true }}
                        ></motion.div>
                        <div className="flex justify-between relative px-4">
                          {["Prompt", "Generate", "Approve", "Live"].map(
                            (step, index) => (
                              <motion.div
                                key={index}
                                className="flex flex-col items-center"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.2 * (index + 1) }}
                                viewport={{ once: true }}
                              >
                                <div className="w-9 h-9 rounded-full bg-[#26a594] flex items-center justify-center z-10 shadow-sm">
                                  <span className="text-white text-xs font-medium">
                                    {index + 1}
                                  </span>
                                </div>
                                <span className="text-xs mt-3 font-medium">
                                  {step}
                                </span>
                              </motion.div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-12"
        >
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-5xl leading-[1.1] font-semibold tracking-[-0.022em] mb-4"
              >
                Image Creation, Simplified
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-xl text-gray-600 font-light leading-relaxed mt-2"
              >
                Create realistic, detailed visuals at production speed without
                relying on stock libraries or traditional shoots.
              </motion.p>
            </motion.div>

            <div className="mb-20 p-2 sm:p-3">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center space-x-2 bg-[#dcf7f3] text-[#2fceb9] px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 mb-8"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 bg-[#2fceb9] rounded-full"
                  ></motion.span>
                  <span>Features</span>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-4xl lg:text-5xl font-semibold tracking-[-0.02em] mb-4"
                >
                  Core Modes
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto"
                >
                  Smart tools that help teams make clear, high-quality visuals every time.
                </motion.p>
              </div>

              {/* Balanced 2x2 Grid */}
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {modes.map((mode, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                      viewport={{ once: true }}
                      whileHover={{
                        y: -8,
                        transition: { duration: 0.3 }
                      }}
                      className="group"
                    >
                      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 hover:border-[#2fceb9]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#2fceb9]/10 h-full">
                        <div className="flex items-start space-x-4 mb-4">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0 w-14 h-14 bg-[#f0fbf9] rounded-xl flex items-center justify-center group-hover:bg-[#2fceb9] transition-colors duration-300"
                          >
                            <div className="text-[#2fceb9] group-hover:text-white transition-colors duration-300">
                              {mode.icon}
                            </div>
                          </motion.div>
                          <div className="flex-1">
                            <h4 className="text-2xl font-semibold mb-3 text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                              {mode.title}
                            </h4>
                            <p className="text-base text-gray-600 leading-relaxed">
                              {mode.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-12 mb-20 p-2 sm:p-3 items-center">
              <div className="relative flex items-center justify-center lg:col-span-2">
                <div
                  className="video-container-wrapper w-full max-w-[600px] p-3 rounded-xl mesh-gradient-background"
                >
                  <motion.div
                    className="video-container w-full overflow-hidden rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <div className="relative aspect-video">
                      <video
                        className="w-full h-full object-cover rounded-lg"
                        src={`https://api.soreal.app/assets/mov/landing-page/generation-demo.mov`}
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls={false}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8 flex flex-col justify-center py-8">
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center space-x-2 bg-[#dcf7f3] text-[#2fceb9] px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    <span className="w-1.5 h-1.5 bg-[#2fceb9] rounded-full"></span>
                    <span>Benefits</span>
                  </motion.div>

                  <div className="space-y-4">
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="text-4xl lg:text-5xl font-semibold tracking-[-0.02em]"
                    >
                      Built for Teams at Every Stage
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: true }}
                      className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto"
                    >
                      Soreal delivers lifelike visuals with the consistency brands need.
                    </motion.p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {[
                    {
                      title: "Unmatched Realism",
                      description: "Generate images with accurate lighting, textures, and detail that look real and build trust."
                    },
                    {
                      title: "API-Ready",
                      description: "Integrate directly into your product, workflow, or CMS to automate image generation at scale."
                    },
                    {
                      title: "Custom Fine-Tuning",
                      description: "Train Soreal on your products or brand style using just a few images to create consistent, ownable visuals.",
                      badge: "Enterprise"
                    },
                    {
                      title: "Fast, Scalable Output",
                      description: "Produce hundreds of assets in minutes to support rapid launches, testing, and creative demands."
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      viewport={{ once: true }}
                      className="text-center space-y-3 p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-[#2fceb9]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#2fceb9]/10"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          {feature.badge && (
                            <span className="text-xs font-medium text-white bg-[#2fceb9] px-2 py-0.5 rounded-full">
                              {feature.badge}
                            </span>
                          )}
                          <h5 className="text-xl font-semibold text-gray-900">
                            {feature.title}
                          </h5>
                        </div>
                        <p className="text-base text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-10 mb-20 p-2 sm:p-3"
            >
              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex justify-center mb-8"
                  >
                    <div className="inline-flex items-center space-x-2 bg-[#dcf7f3] text-[#2fceb9] px-3 py-2 rounded-full text-sm font-medium">
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-[#2fceb9] rounded-full"
                      ></motion.span>
                      <span>Use Cases</span>
                    </div>
                  </motion.div>

                  <div className="space-y-6">
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="text-4xl lg:text-5xl font-semibold tracking-[-0.02em]"
                    >
                      How Teams Use Soreal
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: true }}
                      className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto"
                    >
                      Four core ways teams accelerate their creative workflow
                    </motion.p>
                  </div>
                </motion.div>

                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        icon: Megaphone,
                        title: "Marketing",
                        description: "Create compelling visuals for campaigns, social media, and content marketing."
                      },
                      {
                        icon: Box,
                        title: "Product Design",
                        description: "Visualize products and concepts before manufacturing or development."
                      },
                      {
                        icon: ShoppingBag,
                        title: "E-commerce",
                        description: "Generate professional product images and lifestyle photography."
                      },
                      {
                        icon: Lightbulb,
                        title: "Creative",
                        description: "Explore ideas rapidly and prototype visual concepts instantly."
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.1,
                          ease: "easeOut"
                        }}
                        viewport={{ once: true }}
                        whileHover={{
                          y: -8,
                          transition: { duration: 0.3 }
                        }}
                        className="group"
                      >
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-[#2fceb9]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#2fceb9]/10 h-full">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                            className="w-12 h-12 bg-[#f0fbf9] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2fceb9] transition-colors duration-300"
                          >
                            <item.icon className="h-6 w-6 text-[#2fceb9] group-hover:text-white transition-colors duration-300" />
                          </motion.div>
                          <h4 className="text-lg font-semibold mb-3 text-gray-900">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="py-16 text-center">
              <Link
                href="/learn-more"
                className="inline-flex items-center gap-2 bg-[#dcf7f3] text-[#2fceb9] px-3 py-1 rounded-full text-sm mb-8"
              >
                <span className="w-1.5 h-1.5 bg-[#2fceb9] rounded-full"></span>
                Learn More
              </Link>

              <h2 className="text-[48px] leading-[1.1] font-semibold tracking-[-0.022em] mb-4">
                Experience Soreal Today
              </h2>

              <p className="text-2xl text-gray-600 mb-8 max-w-2xl mx-auto font-light leading-[1.2]">
                Transform your creative process with AI-powered image generation built for professional teams.
              </p>

              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#2fceb9] text-white hover:bg-[#26a594] h-12 px-6 rounded-lg mb-16"
                >
                  Sign Up
                </Button>
              </Link>

              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 bg-white/80 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-4xl font-semibold tracking-[-0.015em] mb-10 text-center">
                  Frequently Asked Questions
                </h2>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-4"
                >
                  <AccordionItem
                    value="item-1"
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="text-xl font-medium py-5 px-6 hover:bg-gray-50">
                      How does Soreal's AI image technology work?
                    </AccordionTrigger>
                    <AccordionContent className="text-left text-lg px-6 py-4 bg-white/60">
                      Soreal uses a cutting-edge text-to-image model trained on
                      billions of high-quality images. It understands how light,
                      texture, and real-world visuals behave. When you enter a
                      prompt, Soreal turns your words into images that look like
                      real photos rather than something generated by code.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="item-2"
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="text-xl font-medium py-5 px-6 hover:bg-gray-50">
                      Can I customize the generated images to match my brand?
                    </AccordionTrigger>
                    <AccordionContent className="text-left text-lg px-6 py-4 bg-white/60">
                      Yes. Soreal gives you creative control so every image
                      aligns with your brand's tone, color, and style. You can
                      guide the composition, subject, and aesthetic to stay
                      consistent across all campaigns, ads, and content.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="item-3"
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="text-xl font-medium py-5 px-6 hover:bg-gray-50">
                      What makes Soreal's image quality superior?
                    </AccordionTrigger>
                    <AccordionContent className="text-left text-lg px-6 py-4 bg-white/60">
                      Soreal focuses on photorealism, delivering images with
                      sharp detail, accurate lighting, and natural depth. From
                      skin texture to reflections and shadows, every element
                      looks realistic and holds up in commercial and
                      professional settings.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="item-4"
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="text-xl font-medium py-5 px-6 hover:bg-gray-50">
                      How can I get started with Soreal?
                    </AccordionTrigger>
                    <AccordionContent className="text-left text-lg px-6 py-4 bg-white/60">
                      Getting started is easy! You can{" "}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (window.Calendly) {
                            window.Calendly.initPopupWidget({
                              url: "https://calendly.com/team-soreal",
                            });
                          }
                          return false;
                        }}
                        style={{ color: "#2fceb9" }}
                        className="underline hover:no-underline"
                      >
                        schedule a call to learn more
                      </a>{" "}
                      about how Soreal can transform your creative workflow.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="item-5"
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="text-xl font-medium py-5 px-6 hover:bg-gray-50">
                      Is Soreal ready for commercial use? Do I own the photos?
                    </AccordionTrigger>
                    <AccordionContent className="text-left text-lg px-6 py-4 bg-white/60">
                      Yes. Soreal is designed for commercial use and works well
                      for marketing, ecommerce, product design, and more. You
                      have full rights to use the images you generate, with no
                      need for stock licenses or studio production.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </motion.div>
        </section>
      </main>
    </div>
  );
};

export default Page;