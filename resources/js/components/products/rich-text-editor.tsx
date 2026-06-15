import Image from '@tiptap/extension-image';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Loader2,
    Sparkles,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import ProductAiController from '@/actions/App/Http/Controllers/User/ProductAiController';
import ProductMediaController from '@/actions/App/Http/Controllers/User/ProductMediaController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatToman } from '@/lib/format';
import { HttpError, postForm, postJson } from '@/lib/http';
import { cn } from '@/lib/utils';

type ToolbarButtonProps = {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
};

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={cn(
                'rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground',
                active && 'bg-muted text-foreground',
            )}
        >
            {children}
        </button>
    );
}

/**
 * A TipTap based rich text editor with list/link/image support and an
 * AI-assisted description generator that charges the user's wallet.
 */
export function RichTextEditor({
    value,
    onChange,
    productId,
    aiContext,
    hasAiModel,
}: {
    value: string;
    onChange: (html: string) => void;
    productId?: number;
    aiContext?: string;
    hasAiModel: boolean;
}) {
    const fileInput = useRef<HTMLInputElement>(null);
    const [aiOpen, setAiOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                link: { openOnClick: false },
            }),
            Image,
        ],
        content: value || '',
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none min-h-40 p-3 focus:outline-none',
                dir: 'rtl',
            },
        },
    });

    if (!editor) {
        return null;
    }

    function setLink() {
        const url = window.prompt('آدرس لینک را وارد کنید:');

        if (url === null) {
            return;
        }

        if (url === '') {
            editor!.chain().focus().extendMarkRange('link').unsetLink().run();

            return;
        }

        editor!
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
    }

    async function uploadImage(file: File) {
        const data = new FormData();
        data.append('image', file);

        if (productId) {
            data.append('product_id', String(productId));
        }

        try {
            const { url } = await postForm<{ url: string }>(
                ProductMediaController.storeEditorImage().url,
                data,
            );
            editor!.chain().focus().setImage({ src: url }).run();
        } catch {
            toast.error('بارگذاری تصویر ناموفق بود.');
        }
    }

    async function generate() {
        setGenerating(true);

        try {
            const result = await postJson<{
                text: string;
                tokens: number;
                cost: number;
            }>(ProductAiController.generateDescription().url, { prompt });

            editor!.chain().focus().insertContent(result.text).run();
            onChange(editor!.getHTML());
            setAiOpen(false);
            setPrompt('');
            toast.success(
                `محتوا تولید شد. ${result.tokens} توکن (${formatToman(result.cost)} تومان) کسر شد.`,
            );
        } catch (error) {
            const message =
                error instanceof HttpError ? error.message : 'خطا در تولید محتوا.';
            toast.error(message);
        } finally {
            setGenerating(false);
        }
    }

    return (
        <div className="rounded-md border">
            <div className="flex flex-wrap items-center gap-0.5 border-b p-1">
                <ToolbarButton
                    title="درشت"
                    active={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="کج"
                    active={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="لیست نقطه‌ای"
                    active={editor.isActive('bulletList')}
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    <List className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="لیست عددی"
                    active={editor.isActive('orderedList')}
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >
                    <ListOrdered className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="لینک"
                    active={editor.isActive('link')}
                    onClick={setLink}
                >
                    <LinkIcon className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="تصویر"
                    onClick={() => fileInput.current?.click()}
                >
                    <ImageIcon className="size-4" />
                </ToolbarButton>

                <div className="ms-auto">
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 text-primary"
                        onClick={() => {
                            setPrompt(aiContext ?? '');
                            setAiOpen(true);
                        }}
                    >
                        <Sparkles className="size-4" />
                        تولید با هوش مصنوعی
                    </Button>
                </div>

                <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                            void uploadImage(file);
                        }

                        event.target.value = '';
                    }}
                />
            </div>

            <EditorContent editor={editor} />

            <Dialog open={aiOpen} onOpenChange={setAiOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>تولید توضیحات با هوش مصنوعی</DialogTitle>
                        <DialogDescription>
                            توضیح کوتاهی درباره محصول بنویسید تا متن کامل ساخته
                            شود. هزینه بر اساس توکن مصرفی از کیف پول کسر می‌شود.
                        </DialogDescription>
                    </DialogHeader>

                    {hasAiModel ? (
                        <div className="grid gap-2">
                            <Label htmlFor="ai-prompt">شرح محصول</Label>
                            <Textarea
                                id="ai-prompt"
                                value={prompt}
                                onChange={(event) =>
                                    setPrompt(event.target.value)
                                }
                                rows={4}
                                placeholder="مثلاً: تیشرت نخی مردانه با یقه گرد و رنگ‌بندی متنوع"
                            />
                        </div>
                    ) : (
                        <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                            ابتدا از بخش تنظیمات هوش مصنوعی یک مدل انتخاب کنید.
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={generate}
                            disabled={
                                !hasAiModel ||
                                generating ||
                                prompt.trim().length < 3
                            }
                            className="gap-1.5"
                        >
                            {generating && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            تولید
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
