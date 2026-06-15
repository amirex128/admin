import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { OrderStatusOption } from '@/types';

/**
 * Horizontal wizard/stepper showing the full order lifecycle, highlighting the
 * completed steps, the current step and the upcoming steps.
 */
export function OrderStatusStepper({
    statuses,
    current,
}: {
    statuses: OrderStatusOption[];
    current: string;
}) {
    const currentIndex = statuses.findIndex(
        (status) => status.value === current,
    );

    return (
        <ol className="flex w-full flex-wrap items-start gap-y-4">
            {statuses.map((status, index) => {
                const isComplete = index < currentIndex;
                const isCurrent = index === currentIndex;
                const isLast = index === statuses.length - 1;

                return (
                    <li
                        key={status.value}
                        className="flex min-w-[88px] flex-1 flex-col items-center"
                    >
                        <div className="flex w-full items-center">
                            <span
                                className={cn(
                                    'h-0.5 flex-1',
                                    index === 0
                                        ? 'opacity-0'
                                        : isComplete || isCurrent
                                          ? 'bg-primary'
                                          : 'bg-border',
                                )}
                            />
                            <span
                                className={cn(
                                    'flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
                                    isComplete &&
                                        'border-primary bg-primary text-primary-foreground',
                                    isCurrent &&
                                        'border-primary bg-background text-primary ring-4 ring-primary/15',
                                    !isComplete &&
                                        !isCurrent &&
                                        'border-border bg-background text-muted-foreground',
                                )}
                            >
                                {isComplete ? (
                                    <Check className="size-4" />
                                ) : (
                                    index + 1
                                )}
                            </span>
                            <span
                                className={cn(
                                    'h-0.5 flex-1',
                                    isLast
                                        ? 'opacity-0'
                                        : isComplete
                                          ? 'bg-primary'
                                          : 'bg-border',
                                )}
                            />
                        </div>
                        <span
                            className={cn(
                                'mt-2 px-1 text-center text-xs',
                                isCurrent
                                    ? 'font-semibold text-foreground'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {status.label}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
