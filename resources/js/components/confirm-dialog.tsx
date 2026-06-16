import { AlertTriangle } from 'lucide-react';
import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type ConfirmOptions = {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
};

type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * Promise-based confirmation dialog built on shadcn `Dialog`, replacing the
 * native `window.confirm`. Call `const confirm = useConfirm();` then
 * `if (!(await confirm({ ... }))) return;`.
 */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>({});
    const resolver = useRef<((value: boolean) => void) | null>(null);
    const [pending, setPending] = useState(false);

    const confirm = useCallback<ConfirmFn>((opts = {}) => {
        setOptions(opts);
        setOpen(true);

        return new Promise<boolean>((resolve) => {
            resolver.current = resolve;
        });
    }, []);

    function settle(value: boolean) {
        setPending(value);
        resolver.current?.(value);
        resolver.current = null;
        setOpen(false);
        setPending(false);
    }

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <Dialog
                open={open}
                onOpenChange={(next) => {
                    if (!next) {
                        settle(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {options.destructive !== false && (
                                <AlertTriangle className="size-5 text-destructive" />
                            )}
                            {options.title ?? 'تایید عملیات'}
                        </DialogTitle>
                        {options.description && (
                            <DialogDescription>
                                {options.description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => settle(false)}
                        >
                            {options.cancelText ?? 'انصراف'}
                        </Button>
                        <Button
                            variant={
                                options.destructive === false
                                    ? 'default'
                                    : 'destructive'
                            }
                            loading={pending}
                            onClick={() => settle(true)}
                        >
                            {options.confirmText ?? 'تایید'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ConfirmContext.Provider>
    );
}

export function useConfirm(): ConfirmFn {
    const ctx = useContext(ConfirmContext);

    if (!ctx) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }

    return ctx;
}
