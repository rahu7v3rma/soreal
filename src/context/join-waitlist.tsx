import JoinWaitlist from "@/components/join-waitlist";
import { createContext, ReactNode, useContext, useState } from "react";

const JoinWaitlistContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export const JoinWaitlistProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <JoinWaitlistContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </JoinWaitlistContext.Provider>
  );
};

export const useJoinWaitlist = () => useContext(JoinWaitlistContext);

export const JoinWaitlistConsumer = () => {
  const { isOpen, setIsOpen } = useJoinWaitlist();
  return <JoinWaitlist isOpen={isOpen} onOpenChange={setIsOpen} />;
};
