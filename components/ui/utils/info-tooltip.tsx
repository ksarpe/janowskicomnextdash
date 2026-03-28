import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

export function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Info className="w-4 h-4 text-text-muted" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}
