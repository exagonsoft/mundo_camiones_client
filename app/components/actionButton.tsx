import { IconPencil, IconTagPlus, IconTrash } from "@tabler/icons-react";
import React from "react";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  type?: "none" | "edit" | "add" | "delete";
  text?: string;
  className?: string;
  onClick?: () => void;
  hideText?: boolean;
}

const ActionButton = ({
  type = "none",
  text,
  className,
  onClick,
  hideText,
}: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 text-sm gap-2 border rounded-md hover:bg-green-900/10 flex items-center justify-center transition-all ease-in-out duration-200",
        className
      )}
    >
      {type === "edit" ? (
        <IconPencil width={20} height={20} />
      ) : type === "delete" ? (
        <IconTrash width={20} height={20} />
      ) : type === "none" ? (
        <></>
      ) : (
        <IconTagPlus width={20} height={20} />
      )}
      {text && (
        <span
          className={`items-center justify-center h-[20px] ${
            hideText && "hidden"
          } md:flex`}
        >
          {text}
        </span>
      )}
    </button>
  );
};

export default ActionButton;
