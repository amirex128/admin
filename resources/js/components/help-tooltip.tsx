import { HelpCircle } from 'lucide-react';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
 * Small inline help icon that reveals an explanatory tooltip. Used across the
 * admin panel to guide users on what a section does and where it appears.
 */
export function HelpTooltip({
    text,
    className,
}: {
    text: string;
    className?: string;
}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        aria-label="راهنما"
                        className={cn(
                            'inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary',
                            className,
                        )}
                    >
                        <HelpCircle className="size-4" />
                    </button>
                </TooltipTrigger>
                <TooltipContent className="font-iransansx leading-relaxed">
                    {text}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
