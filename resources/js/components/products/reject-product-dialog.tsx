import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '@/types';

type Props = {
    trigger: React.ReactNode;
    product: Product;
    /** URL of the admin reject endpoint for this product. */
    submitUrl: string;
};

/**
 * Collects a rejection reason before rejecting a product. The reason is shown
 * back to the seller on their products page.
 */
export function RejectProductDialog({ trigger, product, submitUrl }: Props) {
    const [open, setOpen] = useState(false);
    const { data, setData, patch, processing, errors, reset, clearErrors } =
        useForm({ reason: product.rejection_reason ?? '' });

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        patch(submitUrl, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);

                if (!next) {
                    clearErrors();
                }
            }}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>رد محصول</DialogTitle>
                    <DialogDescription>
                        دلیل رد محصول «{product.name}» را بنویسید. این متن به
                        فروشنده نمایش داده می‌شود.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-sm">دلیل رد</Label>
                        <Textarea
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            rows={3}
                            placeholder="مثلاً تصاویر محصول کیفیت کافی ندارند."
                        />
                        {errors.reason && (
                            <p className="text-xs text-destructive">
                                {errors.reason}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={processing}
                            className="gap-1.5"
                        >
                            {processing && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            ثبت رد محصول
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
