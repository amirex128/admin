import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { GeoOption } from '@/types';

type Props = {
    options: GeoOption[];
    selected: number[];
    onChange: (ids: number[]) => void;
};

/**
 * A searchable multi-select for choosing the products a coupon applies to.
 */
export function ProductMultiselect({ options, selected, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const filtered = useMemo(
        () =>
            options.filter((option) =>
                option.name.toLowerCase().includes(query.toLowerCase()),
            ),
        [options, query],
    );

    function toggle(id: number) {
        onChange(
            selected.includes(id)
                ? selected.filter((value) => value !== id)
                : [...selected, id],
        );
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between font-normal"
                >
                    <span className="truncate">
                        {selected.length > 0
                            ? `${selected.length} محصول انتخاب شده`
                            : 'انتخاب محصولات'}
                    </span>
                    <ChevronsUpDown className="size-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="start">
                <div className="relative border-b">
                    <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="جستجوی محصول"
                        className="border-0 pr-9 focus-visible:ring-0"
                    />
                </div>
                <div className="max-h-60 overflow-y-auto p-1">
                    {filtered.length === 0 && (
                        <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                            محصولی یافت نشد.
                        </p>
                    )}
                    {filtered.map((option) => {
                        const isSelected = selected.includes(option.id);

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => toggle(option.id)}
                                className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                            >
                                <span className="truncate">{option.name}</span>
                                <Check
                                    className={cn(
                                        'size-4',
                                        isSelected
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                    )}
                                />
                            </button>
                        );
                    })}
                </div>
                {selected.length > 0 && (
                    <div className="flex flex-wrap gap-1 border-t p-2">
                        {selected.map((id) => {
                            const option = options.find((o) => o.id === id);

                            return (
                                <Badge
                                    key={id}
                                    variant="secondary"
                                    className="cursor-pointer"
                                    onClick={() => toggle(id)}
                                >
                                    {option?.name ?? id} ✕
                                </Badge>
                            );
                        })}
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
