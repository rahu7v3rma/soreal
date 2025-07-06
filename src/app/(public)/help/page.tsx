"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CHATWITH_HELP_CHATBOT_ID } from "@/constants/chatwith";
import { faqs } from "@/constants/help";
import { Code, ExternalLink, HelpCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div className="container max-w-5xl py-12 h-max">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-2 rounded-full">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-primary">Help Center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="overflow-hidden border-[hsl(var(--border))] shadow-sm hover:shadow-md transition-all">
          <CardHeader className="bg-card pb-4">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>Contact Support</span>
            </CardTitle>
            <CardDescription>Get help from our support team</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button
              onClick={toggleChatbot}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Chat Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-[hsl(var(--border))] shadow-sm hover:shadow-md transition-all">
          <CardHeader className="bg-card pb-4">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <span>API Documentation</span>
            </CardTitle>
            <CardDescription>Integration guides & references</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button
              variant="outline"
              className="w-full border-[hsl(var(--border))] hover:bg-muted"
              asChild
            >
              <Link href="/api-docs">
                View API Docs
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-[hsl(var(--border))] mb-12">
        <h2 className="text-xl font-bold mb-6 text-foreground">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-[hsl(var(--border))]"
            >
              <AccordionTrigger className="hover:text-primary py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground py-3 px-1">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {showChatbot && (
        <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 shadow-lg rounded-lg overflow-hidden">
          <div className="bg-primary p-3 flex justify-between items-center">
            <h3 className="text-primary-foreground font-medium">
              Support Chat
            </h3>
            <button
              onClick={toggleChatbot}
              className="text-primary-foreground hover:bg-primary/80 rounded-full p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <iframe
            id="chat-widget"
            src={`https://chatwith.tools/embed/${CHATWITH_HELP_CHATBOT_ID}`}
            width="100%"
            height="400"
            style={{ border: "none" }}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Page;
