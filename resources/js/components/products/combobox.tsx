import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type ComboboxOption = {
    value: number;
    label: string;
    hint?: string | null;
};

/**
 * A searchable select with an optional footer slot (used to render a
 * "create new" action). Selection is controlled by the parent.
 */
export function Combobox({
    options,
    value,
    onChange,
    placeholder = 'انتخاب کنید',
    searchPlaceholder = 'جستجو...',
    emptyText = 'موردی یافت نشد.',
    footer,
}: {
    options: ComboboxOption[];
    value: number | null;
    onChange: (value: number | null) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    footer?: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const selected = options.find((option) => option.value === value) ?? null;

    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase();

        if (term === '') {
            return options;
        }

        return options.filter((option) =>
            option.label.toLowerCase().includes(term),
        );
    }, [options, query]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                >
                    <span
                        className={cn(!selected && 'text-muted-foreground')}
                    >
                        {selected ? selected.label : placeholder}
                    </span>
                    <ChevronsUpDown className="size-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0"
                align="start"
            >
                <div className="relative border-b">
                    <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={searchPlaceholder}
                        className="border-0 pr-9 shadow-none focus-visible:ring-0"
                    />
                </div>

                <ul className="max-h-56 overflow-y-auto p-1">
                    {value !== null && (
                        <li>
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(null);
                                    setOpen(false);
                                }}
                                className="w-full rounded-sm px-2 py-1.5 text-start text-sm text-muted-foreground hover:bg-muted"
                            >
                                حذف انتخاب
                            </button>
                        </li>
                    )}

                    {filtered.length === 0 ? (
                        <li className="px-2 py-3 text-center text-sm text-muted-foreground">
                            {emptyText}
                        </li>
                    ) : (
                        filtered.map((option) => (
                            <li key={option.value}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    className="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-start text-sm hover:bg-muted"
                                >
                                    <span className="flex items-center gap-2">
                                        <Check
                                            className={cn(
                                                'size-4',
                                                option.value === value
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                        {option.label}
                                    </span>
                                    {option.hint && (
                                        <span className="text-xs text-muted-foreground">
                                            {option.hint}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))
                    )}
                </ul>

                {footer && (
                    <div className="border-t p-1">{footer}</div>
                )}
            </PopoverContent>
        </Popover>
    );
}
