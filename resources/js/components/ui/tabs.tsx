import * as React from 'react';

import { cn } from '@/lib/utils';

type TabsContextValue = {
    value: string;
    setValue: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
    const context = React.useContext(TabsContext);

    if (!context) {
        throw new Error('Tabs components must be used within <Tabs>.');
    }

    return context;
}

type TabsProps = {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    children: React.ReactNode;
};

/**
 * A lightweight, dependency-free Tabs implementation matching the shadcn/ui API.
 */
function Tabs({
    defaultValue,
    value,
    onValueChange,
    className,
    children,
}: TabsProps) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const current = isControlled ? value : internal;

    const setValue = React.useCallback(
        (next: string) => {
            if (!isControlled) {
                setInternal(next);
            }

            onValueChange?.(next);
        },
        [isControlled, onValueChange],
    );

    return (
        <TabsContext.Provider value={{ value: current, setValue }}>
            <div
                data-slot="tabs"
                className={cn('flex flex-col gap-4', className)}
            >
                {children}
            </div>
        </TabsContext.Provider>
    );
}

function TabsList({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="tabs-list"
            role="tablist"
            className={cn(
                'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1',
                className,
            )}
            {...props}
        />
    );
}

type TabsTriggerProps = React.ComponentProps<'button'> & {
    value: string;
};

function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
    const { value: current, setValue } = useTabs();
    const isActive = current === value;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            data-state={isActive ? 'active' : 'inactive'}
            onClick={() => setValue(value)}
            className={cn(
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                className,
            )}
            {...props}
        />
    );
}

type TabsContentProps = React.ComponentProps<'div'> & {
    value: string;
};

function TabsContent({ className, value, ...props }: TabsContentProps) {
    const { value: current } = useTabs();

    if (current !== value) {
        return null;
    }

    return (
        <div
            data-slot="tabs-content"
            role="tabpanel"
            className={cn('flex-1 outline-none', className)}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
