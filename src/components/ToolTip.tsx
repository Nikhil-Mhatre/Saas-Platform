import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React from 'react';

interface ItoolTip {
  children: React.ReactNode;
  toolTipContent: string;
}

const ToolTip: React.FC<ItoolTip> = ({ children, toolTipContent }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{toolTipContent}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default ToolTip;
