import * as React from 'react';

import { cn } from '@/lib/utils';

type SwitchProps = {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    id?: string;
    name?: string;
};

/**
 * A dependency-free switch that mirrors the shadcn/ui Switch API
 * (checked / onCheckedChange) without pulling in a Radix package.
 */
function Switch({
    checked,
    defaultChecked,
    onCheckedChange,
    disabled,
    className,
    id,
    name,
}: SwitchProps) {
    const isControlled = checked !== undefined;
    const [internal, setInternal] = React.useState(defaultChecked ?? false);
    const isChecked = isControlled ? checked : internal;

    function toggle() {
        if (disabled) {
            return;
        }

        if (!isControlled) {
            setInternal((value) => !value);
        }

        onCheckedChange?.(!isChecked);
    }

    return (
        <button
            type="button"
            role="switch"
            id={id}
            name={name}
            aria-checked={isChecked}
            data-state={isChecked ? 'checked' : 'unchecked'}
            disabled={disabled}
            onClick={toggle}
            className={cn(
                'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
                isChecked ? 'bg-primary' : 'bg-input',
                className,
            )}
        >
            <span
                data-state={isChecked ? 'checked' : 'unchecked'}
                className={cn(
                    'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform',
                    // RTL-aware: in an RTL container the checked thumb moves left.
                    isChecked
                        ? 'ltr:translate-x-4 rtl:-translate-x-4'
                        : 'translate-x-0',
                )}
            />
        </button>
    );
}

export { Switch };
