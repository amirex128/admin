import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
    JALALI_MONTHS,
    JALALI_WEEKDAYS,
    formatJalaali,
    isoToJalaali,
    jalaaliFirstWeekday,
    jalaaliMonthLength,
    jalaaliToIso,
    toJalaali,
} from '@/lib/jalali';

type Props = {
    value: string | null;
    onChange: (iso: string | null) => void;
    placeholder?: string;
    id?: string;
};

/**
 * A Persian (Jalaali) calendar date picker. Displays and selects dates in the
 * Jalaali calendar while emitting an ISO (Gregorian) `YYYY-MM-DD` string so the
 * backend stores standard timestamps.
 */
export function JalaliDatePicker({
    value,
    onChange,
    placeholder = 'انتخاب تاریخ',
    id,
}: Props) {
    const today = toJalaali(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate(),
    );
    const selected = value ? isoToJalaali(value) : null;

    const [open, setOpen] = useState(false);
    const [viewYear, setViewYear] = useState(selected?.jy ?? today.jy);
    const [viewMonth, setViewMonth] = useState(selected?.jm ?? today.jm);

    function move(delta: number) {
        let month = viewMonth + delta;
        let year = viewYear;
        if (month < 1) {
            month = 12;
            year -= 1;
        } else if (month > 12) {
            month = 1;
            year += 1;
        }
        setViewMonth(month);
        setViewYear(year);
    }

    const daysInMonth = jalaaliMonthLength(viewYear, viewMonth);
    const leadingBlanks = jalaaliFirstWeekday(viewYear, viewMonth);
    const cells: (number | null)[] = [
        ...Array.from({ length: leadingBlanks }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    function select(day: number) {
        onChange(jalaaliToIso(viewYear, viewMonth, day));
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    type="button"
                    variant="outline"
                    className={cn(
                        'w-full justify-start gap-2 font-normal',
                        !value && 'text-muted-foreground',
                    )}
                >
                    <CalendarDays className="size-4" />
                    {value ? formatJalaali(value) : placeholder}
                    {value && (
                        <span
                            role="button"
                            tabIndex={0}
                            className="mr-auto inline-flex text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(null);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.stopPropagation();
                                    onChange(null);
                                }
                            }}
                        >
                            <X className="size-3.5" />
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3" align="start">
                <div className="mb-2 flex items-center justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => move(-1)}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                    <span className="text-sm font-medium">
                        {JALALI_MONTHS[viewMonth - 1]} {viewYear}
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => move(1)}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                    {JALALI_WEEKDAYS.map((weekday) => (
                        <span key={weekday} className="py-1">
                            {weekday}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {cells.map((day, index) => {
                        if (day === null) {
                            return <span key={`b-${index}`} />;
                        }

                        const isSelected =
                            selected !== null &&
                            selected.jy === viewYear &&
                            selected.jm === viewMonth &&
                            selected.jd === day;
                        const isToday =
                            today.jy === viewYear &&
                            today.jm === viewMonth &&
                            today.jd === day;

                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() => select(day)}
                                className={cn(
                                    'flex size-8 items-center justify-center rounded-md text-sm hover:bg-muted',
                                    isSelected &&
                                        'bg-primary text-primary-foreground hover:bg-primary',
                                    !isSelected &&
                                        isToday &&
                                        'border border-primary',
                                )}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}
