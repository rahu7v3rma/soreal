import * as React from "react";

import { cn } from "@/lib/utils/common";

const FileInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      type="file"
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-muted file:text-foreground file:text-sm file:font-medium file:px-3 file:py-2 file:mr-3 file:rounded-l-md file:cursor-pointer placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm cursor-pointer",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
FileInput.displayName = "FileInput";

export { FileInput }; 