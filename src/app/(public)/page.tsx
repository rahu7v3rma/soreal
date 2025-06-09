"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shared/accordion";
import { Button } from "@/components/shared/button";
import { SorealLogo } from "@/components/shared/logo";
import ModeGrid from "@/components/shared/mode-grid";
import {
  BLUR_DATA_URL,
  IMAGE_URLS,
  testimonials,
} from "@/constants/landing-page";
import { shuffle } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "./page.css";
import { useJoinWaitlist } from "@/context/join-waitlist";
import Link from "next/link";

const images = shuffle(IMAGE_URLS);

const Page = () => {
  const { setIsOpen: setIsJoinWaitlistOpen } = useJoinWaitlist();

  const [testimonialCurrentIndex, setTestimonialCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showImage, setShowImage] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const calendlyScriptRef = useRef<HTMLScriptElement | null>(null);
  const calendlyStyleRef = useRef<HTMLLinkElement | null>(null);

  const handleVideoEnded = () => {
    setShowImage(true);

    if (videoRef.current) {
      videoRef.current.style.opacity = "0";

      setTimeout(() => setFadeIn(true), 100);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.classList.add("hidden");
        }
      }, 500);
    }
  };

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
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.5,
      }
    );

    const containerRefCurrent = containerRef.current;

    if (containerRefCurrent) {
      observer.observe(containerRefCurrent);
    }

    return () => {
      if (containerRefCurrent) {
        observer.unobserve(containerRefCurrent);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView && videoRef.current && !hasPlayed) {
      videoRef.current
        .play()
        .then(() => {
          setHasPlayed(true);
        })
        .catch();
    }
  }, [isInView, hasPlayed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialCurrentIndex(
        (prevIndex) => (prevIndex + 1) % testimonials.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
              <h1
                className="text-[80px] sm:text-[96px] md:text-[112px] leading-[1.1] font-semibold tracking-[-0.022em] mb-8 text-white hero-title text-shadow-lg"
                style={{
                  filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15))",
                }}
              >
                AI Built for Realism
              </h1>
              <p
                className="text-xl sm:text-1xl md:text-2xl font-light hero-subheadline w-full whitespace-nowrap"
                style={{
                  filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15))",
                }}
              >
                Stock photos slow you down. Soreal creates photorealistic
                visuals in seconds.
              </p>
              <div className="flex items-center gap-4">
                <Button
                  className="h-14 px-8 text-lg bg-[#2fceb9] text-white hover:bg-[#26a594] rounded-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    // @ts-expect-error - Calendly is loaded from external script
                    window.Calendly?.initPopupWidget({
                      url: "https://calendly.com/team-soreal",
                    });
                  }}
                >
                  Schedule Demo
                </Button>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop"
                    alt="User"
                    className="w-7 h-7 rounded-full border-2 border-white"
                    width={48}
                    height={48}
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=48&h=48&fit=crop"
                    alt="User"
                    className="w-7 h-7 rounded-full border-2 border-white"
                    width={48}
                    height={48}
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop"
                    alt="User"
                    className="w-7 h-7 rounded-full border-2 border-white"
                    width={48}
                    height={48}
                  />
                </div>
                <p className="text-base text-white trusted-by-text">
                  Trusted by creative teams worldwide.
                </p>
              </div>
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

                  <div className="flex flex-col sm:flex-row gap-8 max-w-4xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      viewport={{ once: true }}
                      className="flex-1 rounded-xl overflow-hidden shadow-md border border-[#2fceb9]/30 backdrop-blur-sm bg-white/60"
                    >
                      <div className="bg-gray-100 aspect-square relative overflow-hidden">
                        <Image
                          src={`https://api.soreal.app/assets/gif/landing-page/soreal-generation-demo.gif`}
                          alt="Soreal Result"
                          fill
                          className="object-cover"
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
                      <div className="p-4 text-sm text-center text-gray-600 border-t border-[#dcf7f3]">
                        Generate a high-resolution, photorealistic portrait of a
                        person in natural lighting, with sharp facial detail,
                        soft depth of field, and realistic skin texture.
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      viewport={{ once: true }}
                      className="flex-1 rounded-xl overflow-hidden shadow-md backdrop-blur-sm bg-white/60 border border-gray-100"
                    >
                      <div className="bg-gray-100 aspect-square relative overflow-hidden">
                        <Image
                          src={`https://api.soreal.app/assets/gif/landing-page/competitor-generation-demo.gif`}
                          alt="Generic Output"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-4 inset-x-0 flex justify-center">
                          <p className="text-sm text-gray-500 bg-white/80 px-2 py-1 rounded-md">
                            Competitor
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-200 p-3 text-sm text-center">
                        25s average render
                      </div>
                      <div className="p-4 text-sm text-center text-gray-600 border-t border-gray-200">
                        Generate a high-resolution, photorealistic portrait of a
                        person in natural lighting, with sharp facial detail,
                        soft depth of field, and realistic skin texture.
                      </div>
                    </motion.div>
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

                  <div className="space-y-4 mt-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="space-y-4"
                    >
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            Photoshoot
                          </span>
                          <span className="text-sm font-medium">$300+</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-[#1a8a7a] h-2.5 rounded-full"
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Stock</span>
                          <span className="text-sm font-medium">$50–150</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-[#26a594] h-2.5 rounded-full"
                            style={{ width: "40%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Editing</span>
                          <span className="text-sm font-medium">$25–75</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-[#2fceb9] h-2.5 rounded-full"
                            style={{ width: "20%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            Soreal Premium Mode
                          </span>
                          <span className="text-sm font-medium">$0.10</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-[#6dded0] h-2.5 rounded-full"
                            style={{ width: "0.5%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            Soreal Standard Mode
                          </span>
                          <span className="text-sm font-medium">$0.01</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-[#a9ebe3] h-2.5 rounded-full"
                            style={{ width: "0.1%" }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
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

        <div className="py-12">
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="text-center mb-10">
              <h2 className="text-[48px] leading-[1.1] font-semibold tracking-[-0.022em] mb-4">
                Image Creation, Simplified
              </h2>
              <p className="text-2xl text-gray-600 font-light leading-[1.2] mt-2">
                Create realistic, detailed visuals at production speed without
                relying on stock libraries or traditional shoots.
              </p>
            </div>

            <div className="mb-20 p-2 sm:p-3">
              <div className="mb-12">
                <div className="inline-flex items-center space-x-2 bg-[#dcf7f3] text-[#2fceb9] px-2 py-1 rounded-full text-sm">
                  <span className="w-1.5 h-1.5 bg-[#2fceb9] rounded-full"></span>
                  <span>Features</span>
                </div>

                <h3 className="text-4xl font-semibold tracking-[-0.02em] mt-4">
                  Core Modes
                </h3>
                <p className="text-xl text-gray-600 font-light leading-relaxed mt-3 max-w-3xl">
                  Smart tools that help teams make clear, high-quality visuals
                  every time.
                </p>
              </div>

              <ModeGrid />
            </div>

            <div className="grid md:grid-cols-2 gap-10 mb-20 p-2 sm:p-3">
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-2 bg-[#dcf7f3] text-[#2fceb9] px-2 py-1 rounded-full text-sm font-medium">
                  <span className="w-1.5 h-1.5 bg-[#2fceb9] rounded-full"></span>
                  <span>Benefits</span>
                </div>

                <h3 className="text-4xl font-semibold tracking-[-0.02em]">
                  Built for Teams at Every Stage
                </h3>
                <p className="text-xl text-gray-600 font-light leading-relaxed">
                  Soreal sets the standard for lifelike, diverse imagery with
                  the performance and precision brands rely on.
                </p>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <h5 className="text-lg font-medium mb-2">
                        Unmatched Realism
                      </h5>
                      <p className="text-base text-gray-600">
                        Generate images with accurate lighting, textures, and
                        detail that look real and build trust.
                      </p>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium mb-2">API-Ready</h5>
                      <p className="text-base text-gray-600">
                        Integrate directly into your product, workflow, or CMS
                        to automate image generation at scale.
                      </p>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium mb-2 flex items-center">
                        Custom Fine-Tuning
                        <span className="ml-2 text-xs font-medium text-white bg-[#2fceb9] px-2 py-0.5 rounded-full">
                          Enterprise
                        </span>
                      </h5>
                      <p className="text-base text-gray-600">
                        Train Soreal on your products or brand style using just
                        a few images to create consistent, ownable visuals.
                      </p>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium mb-2">
                        Fast, Scalable Output
                      </h5>
                      <p className="text-base text-gray-600">
                        Produce hundreds of assets in minutes to support rapid
                        launches, testing, and creative demands.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div
                  ref={containerRef}
                  className="video-container-wrapper w-full max-w-[600px] p-4 rounded-2xl mesh-gradient-background"
                >
                  <motion.div
                    className="video-container w-full overflow-hidden rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <div className="relative aspect-video">
                      <motion.video
                        ref={videoRef}
                        className="w-full h-full object-contain rounded-xl"
                        src={`https://api.soreal.app/assets/mov/landing-page/generation-demo.mov`}
                        muted
                        playsInline
                        onEnded={handleVideoEnded}
                        style={{ transition: "opacity 0.5s ease-in-out" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isInView && !showImage ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        Your browser does not support the video tag.
                      </motion.video>

                      <motion.div
                        className={`absolute inset-0 overflow-hidden rounded-xl ${!showImage ? "pointer-events-none" : ""}`}
                        style={{
                          opacity: fadeIn ? 1 : 0,
                          transition: "opacity 0.8s ease-in-out",
                          zIndex: showImage ? 2 : 1,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: fadeIn ? 1 : 0 }}
                        transition={{ duration: 0.8 }}
                      >
                        <Image
                          src={`https://api.soreal.app/assets/png/landing-page/a-desert-at-dusk.png`}
                          alt="Desert at dusk"
                          fill
                          className="object-contain rounded-xl"
                          priority
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 mb-20 p-2 sm:p-3">
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-2 bg-[#dcf7f3] text-[#2fceb9] px-2 py-1 rounded-full text-sm font-medium">
                  <span className="w-1.5 h-1.5 bg-[#2fceb9] rounded-full"></span>
                  <span>Use-Cases</span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-4xl font-semibold tracking-[-0.02em]">
                    Tailored for Creative, Scalable Production
                  </h3>
                  <p className="text-xl text-gray-600 font-light leading-relaxed">
                    Soreal adapts to the pace and precision of modern teams,
                    from early-stage startups to global brands.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium tracking-[-0.01em]">
                      Marketing & Creative Teams
                    </h4>
                    <p className="text-base text-gray-600">
                      Produce brand-aligned visuals at scale with control over
                      tone, style, and storytelling.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Startups</h4>
                    <p className="text-base text-gray-600">
                      Launch faster with high-quality visuals that save time,
                      reduce design costs, and remove the need for stock.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">
                      Product, Industrial, and Architectural Design
                    </h4>
                    <p className="text-base text-gray-600">
                      Preview products, spaces, and structures before anything
                      is built or manufactured.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Online Retail</h4>
                    <p className="text-base text-gray-600">
                      Create photorealistic product shots, variants, and
                      lifestyle images without expensive studio work.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden relative group">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #f8fcfb 0%, #e8f8f6 100%)",
                    }}
                  ></div>

                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2347d7c4' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
                      backgroundSize: "20px 20px",
                    }}
                  ></div>

                  <div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(47, 206, 185, 0.6) 0%, rgba(47, 206, 185, 0) 70%)",
                    }}
                  ></div>

                  <div
                    className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(47, 206, 185, 0.6) 0%, rgba(47, 206, 185, 0) 70%)",
                    }}
                  ></div>

                  <div className="relative w-full h-full overflow-hidden">
                    <div
                      className="absolute inset-0 rounded-3xl"
                      style={{
                        background: "rgba(255, 255, 255, 0.12)",
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    ></div>

                    <div className="relative h-full flex items-center justify-center p-8 z-10">
                      <div className="w-full relative">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={testimonialCurrentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7, ease: "easeInOut" }}
                            className="flex items-start space-x-6"
                          >
                            <div
                              className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border border-white/30"
                              style={{
                                background: "rgba(255, 255, 255, 0.1)",
                                backdropFilter: "blur(5px)",
                              }}
                            >
                              <Image
                                src={
                                  testimonials[testimonialCurrentIndex].avatar
                                }
                                alt={testimonials[testimonialCurrentIndex].name}
                                className="w-full h-full object-cover"
                                fill
                              />
                            </div>

                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-800">
                                {testimonials[testimonialCurrentIndex].name}
                              </h3>
                              <p className="text-gray-500 mb-4">
                                @
                                {testimonials[testimonialCurrentIndex].username}
                              </p>
                              <p className="text-gray-700 leading-relaxed">
                                {testimonials[testimonialCurrentIndex].text}
                              </p>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setTestimonialCurrentIndex(index)}
                          className="relative"
                        >
                          <div
                            className={`transition-all duration-300 ${
                              index === testimonialCurrentIndex
                                ? "w-2 h-2 bg-[#2fceb9]/90"
                                : "w-2 h-2 bg-gray-300/40"
                            } rounded-full`}
                            style={{
                              backdropFilter: "blur(2px)",
                            }}
                          />
                          <span className="sr-only">{`View testimonial ${index + 1}`}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                Transform your creative process with AI-powered image generation
                built for professional teams.
              </p>

              {/* <Button
                size="lg"
                className="bg-[#2fceb9] text-white hover:bg-[#26a594] h-12 px-6 rounded-lg mb-16"
                onClick={() => router.push("/signup")}
              >
                Get Started
              </Button> */}
              <Button
                size="lg"
                className="bg-[#2fceb9] text-white hover:bg-[#26a594] h-12 px-6 rounded-lg mb-16"
                onClick={() => setIsJoinWaitlistOpen(true)}
              >
                Join Waitlist
              </Button>

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
                      Can I train Soreal to generate the same person, animal, or
                      object in different scenes?
                    </AccordionTrigger>
                    <AccordionContent className="text-left text-lg px-6 py-4 bg-white/60">
                      Yes. With just five reference images, Soreal can be
                      fine-tuned to recognize and recreate the same subject
                      across a range of settings and styles. This is part of our
                      Enterprise plan, and our team manages the training process
                      for you.{" "}
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          // @ts-expect-error - Calendly is loaded from external script
                          window.Calendly.initPopupWidget({
                            url: "https://calendly.com/team-soreal",
                          });
                          return false;
                        }}
                        style={{ color: "#2fceb9" }}
                      >
                        Schedule a call to learn more
                      </a>
                      .
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
        </div>
      </main>
    </div>
  );
};

export default Page;
