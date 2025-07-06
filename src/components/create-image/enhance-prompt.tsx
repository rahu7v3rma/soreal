"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useApi } from "@/hooks/api";
import { Loader, Wand2 } from "lucide-react";
import { useEffect } from "react";

const EnhancePrompt = ({
  prompt,
  setPrompt,
  setIsEnhancingPrompt,
}: {
  prompt: string;
  setPrompt: (prompt: string) => void;
  setIsEnhancingPrompt: (isEnhancingPrompt: boolean) => void;
}) => {
  const { handleEnhancePrompt, isEnhancingPrompt } = useApi();

  useEffect(() => {
    setIsEnhancingPrompt(isEnhancingPrompt);
  }, [isEnhancingPrompt]);

  return (
    <div className="flex items-center justify-end">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              disabled={isEnhancingPrompt || !prompt.trim()}
              onClick={() => {
                handleEnhancePrompt(prompt).then((enhancedPrompt) => {
                  if (enhancedPrompt) {
                    setPrompt(enhancedPrompt);
                  }
                });
              }}
            >
              {isEnhancingPrompt ? (
                <>
                  <Loader className="h-3.5 w-3.5 animate-spin" />
                  <span>Enhancing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-3.5 w-3.5" />
                  <span>Enhance Prompt</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="end" className="max-w-sm p-4">
            <p>
              Let AI improve your prompt by adding helpful keywords and
              descriptors to get the best results.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default EnhancePrompt;
