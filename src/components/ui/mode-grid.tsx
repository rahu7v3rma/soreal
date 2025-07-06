"use client";

import { modes } from "@/constants/ui/model-grid";

const ModeCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
      <div className="mb-4 text-[#2fceb9] flex items-center justify-center h-12 w-12 rounded-full bg-[#f0fbf9]">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-sm text-center">{description}</p>
    </div>
  );
};

export default function ModeGrid() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {modes.map((mode, index) => (
          <ModeCard
            key={index}
            icon={mode.icon}
            title={mode.title}
            description={mode.description}
          />
        ))}
      </div>
    </div>
  );
}
