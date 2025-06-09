"use client";

import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Label } from "@/components/shared/label";
import { useSupabase } from "@/context/supabase";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader } from "lucide-react";
import { useState } from "react";
import { isEmailValid } from "@/lib/utils";
import { useToast } from "./shared/toast";

const JoinWaitlist = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { joinWaitlist, joinWaitlistLoading } = useSupabase();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal
        container={typeof document !== "undefined" ? document.body : undefined}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-[999]" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[1000] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
            Join the Waitlist
          </Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground">
            Be the first to know when Soreal is ready.
          </Dialog.Description>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Name</Label>
              <Input
                id="name"
                placeholder="e.g., John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Provide your name to identify yourself.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="e.g., johndoe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We'll use this email to send you updates about Soreal.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              onClick={async () => {
                if (!isEmailValid(email)) {
                  toast({
                    title: "Invalid email address",
                    variant: "destructive",
                  });
                  return;
                }

                const joinWaitlistResponse = await joinWaitlist({
                  name,
                  email,
                });
                if (joinWaitlistResponse) {
                  onOpenChange(false);
                  setName("");
                  setEmail("");
                }
              }}
              disabled={joinWaitlistLoading || !name.trim() || !email.trim()}
            >
              {joinWaitlistLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                "Join Waitlist"
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default JoinWaitlist;
