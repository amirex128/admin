import { router } from '@inertiajs/react';
import { Download, FileSpreadsheet, Loader2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import ProductImportController from '@/actions/App/Http/Controllers/User/ProductImportController';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { HttpError, postForm } from '@/lib/http';
import type { ImportField } from '@/types';

const NONE = '__none__';

type PreviewResponse = {
    token: string;
    headers: string[];
    rows: (string | number | null)[][];
    fields: ImportField[];
};

/**
 * A guided Excel import: upload a file, preview the first rows, map the file's
 * columns onto product fields, then run the import (which also bulk-updates
 * existing products detected by id or SKU).
 */
export function ExcelImportDialog({ trigger }: { trigger: React.ReactNode }) {
    const fileInput = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [preview, setPreview] = useState<PreviewResponse | null>(null);
    const [mapping, setMapping] = useState<Record<string, string>>({});

    function reset() {
        setPreview(null);
        setMapping({});
    }

    async function upload(file: File) {
        setUploading(true);

        const data = new FormData();
        data.append('file', file);

        try {
            const result = await postForm<PreviewResponse>(
                ProductImportController.preview().url,
                data,
            );
            setPreview(result);

            // Auto-map columns whose header matches a field label.
            const auto: Record<string, string> = {};
            result.fields.forEach((field) => {
                const index = result.headers.findIndex(
                    (header) =>
                        header.trim() === field.label.trim() ||
                        header.trim() === field.key,
                );

                if (index !== -1) {
                    auto[field.key] = String(index);
                }
            });
            setMapping(auto);
        } catch (error) {
            const message =
                error instanceof HttpError ? error.message : 'بارگذاری ناموفق بود.';
            toast.error(message);
        } finally {
            setUploading(false);
        }
    }

    function runImport() {
        if (!preview) {
            return;
        }

        const payload: Record<string, number> = {};
        Object.entries(mapping).forEach(([field, column]) => {
            if (column !== NONE && column !== '') {
                payload[field] = Number(column);
            }
        });

        if (payload.name === undefined) {
            toast.error('ستون «نام محصول» باید انتخاب شود.');

            return;
        }

        setImporting(true);

        router.post(
            ProductImportController.import().url,
            { token: preview.token, mapping: payload },
            {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                },
                onError: () => toast.error('ایمپورت ناموفق بود.'),
                onFinish: () => setImporting(false),
            },
        );
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);

                if (!next) {
                    reset();
                }
            }}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>ایمپورت هوشمند اکسل</DialogTitle>
                    <DialogDescription>
                        فایل اکسل را بارگذاری کنید، ستون‌های آن را با فیلدهای
                        سیستم تطبیق دهید و ایمپورت کنید. محصولات تکراری بر اساس
                        شناسه به‌روزرسانی می‌شوند.
                    </DialogDescription>
                </DialogHeader>

                {!preview ? (
                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => fileInput.current?.click()}
                            className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed p-10 text-muted-foreground hover:bg-muted"
                        >
                            {uploading ? (
                                <Loader2 className="size-8 animate-spin" />
                            ) : (
                                <FileSpreadsheet className="size-8" />
                            )}
                            <span className="text-sm">
                                برای انتخاب فایل اکسل کلیک کنید (xlsx, xls, csv)
                            </span>
                        </button>
                        <input
                            ref={fileInput}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                            onChange={(event) => {
                                const file = event.target.files?.[0];

                                if (file) {
                                    void upload(file);
                                }

                                event.target.value = '';
                            }}
                        />

                        <a
                            href={ProductImportController.template().url}
                            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                        >
                            <Download className="size-4" />
                            دانلود فایل نمونه
                        </a>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="grid gap-3 sm:grid-cols-2">
                            {preview.fields.map((field) => (
                                <div
                                    key={field.key}
                                    className="grid grid-cols-2 items-center gap-2"
                                >
                                    <Label className="text-sm">
                                        {field.label}
                                        {field.required && (
                                            <span className="text-destructive">
                                                {' '}
                                                *
                                            </span>
                                        )}
                                    </Label>
                                    <Select
                                        value={mapping[field.key] ?? NONE}
                                        onValueChange={(value) =>
                                            setMapping((current) => ({
                                                ...current,
                                                [field.key]: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="ستون..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>
                                                — نادیده بگیر —
                                            </SelectItem>
                                            {preview.headers.map(
                                                (header, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        value={String(index)}
                                                    >
                                                        {header || `ستون ${index + 1}`}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-lg border">
                            <div className="border-b bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                                پیش‌نمایش چند ردیف اول
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {preview.headers.map(
                                                (header, index) => (
                                                    <TableHead key={index}>
                                                        {header}
                                                    </TableHead>
                                                ),
                                            )}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {preview.rows.map((row, rowIndex) => (
                                            <TableRow key={rowIndex}>
                                                {preview.headers.map(
                                                    (_, columnIndex) => (
                                                        <TableCell
                                                            key={columnIndex}
                                                        >
                                                            {row[columnIndex] ??
                                                                ''}
                                                        </TableCell>
                                                    ),
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={reset}
                            >
                                انتخاب فایل دیگر
                            </Button>
                            <Button
                                type="button"
                                onClick={runImport}
                                disabled={importing}
                                className="gap-1.5"
                            >
                                {importing ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Upload className="size-4" />
                                )}
                                ایمپورت
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
