import React, { ElementType } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  value?: number;
  message?: string;
  Icon: ElementType;
  className?: string;
}

const InfoCard = ({
  title,
  value,
  message,
  Icon,
  className,
}: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg p-8 py-4 gap-4 flex flex-col justify-start items-start shadow-md",
        className
      )}
    >
      <div className="w-full flex justify-between">
        <span className="capitalize text-blue-600 font-bold text-lg">
          {title}
        </span>
        <Icon width={24} height={24} className="text-blue-950"/>
      </div>
      <div className="flex flex-col items-start justify-center min-h-20">
        <span className="text-2xl font-bold text-blue-950">{value}</span>
        <span className="text-sm text-gray-500">{message}</span>
      </div>
    </div>
  );
};

export default InfoCard;
