import React, { useRef, useState } from 'react';
import {
    Heading2, Heading3, Bold, Italic, Strikethrough, Link2, Quote, List, ListOrdered,
    Code, Code2, Table, Minus, ImagePlus, Pencil, Columns, Eye, Loader2,
} from 'lucide-react';
import MarkdownContent from '../MarkdownContent';
import { portfolioService } from '../../lib/supabase';

type ViewMode = 'write' | 'split' | 'preview';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const countWords = (text: string) =>
    text.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`~\-\[\]()!|]/g, ' ').split(/\s+/).filter(Boolean).length;

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mode, setMode] = useState<ViewMode>('write');
    const [uploads, setUploads] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Replace text between start/end, keeping the browser's native undo history when possible
    const replaceRange = (start: number, end: number, text: string, selStart?: number, selEnd?: number) => {
        const el = textareaRef.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(start, end);
        // Only use execCommand when the textarea really has focus (it can't while hidden in preview mode)
        const ok = document.activeElement === el
            && typeof document.execCommand === 'function'
            && document.execCommand('insertText', false, text);
        if (!ok) {
            onChange(el.value.slice(0, start) + text + el.value.slice(end));
        }
        const s = start + (selStart ?? text.length);
        const e = start + (selEnd ?? selStart ?? text.length);
        requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(s, e);
        });
    };

    const getSelection = () => {
        const el = textareaRef.current!;
        return { start: el.selectionStart, end: el.selectionEnd, text: el.value.slice(el.selectionStart, el.selectionEnd), value: el.value };
    };

    const wrap = (before: string, after: string, fallback: string) => {
        const { start, end, text } = getSelection();
        const inner = text || fallback;
        replaceRange(start, end, `${before}${inner}${after}`, before.length, before.length + inner.length);
    };

    // Apply a prefix to every selected line (toggles off if all lines already have it)
    const prefixLines = (prefix: string | ((i: number) => string)) => {
        const { start, end, value: v } = getSelection();
        const lineStart = v.lastIndexOf('\n', start - 1) + 1;
        const lineEndIdx = v.indexOf('\n', end);
        const lineEnd = lineEndIdx === -1 ? v.length : lineEndIdx;
        const lines = v.slice(lineStart, lineEnd).split('\n');
        const getPrefix = (i: number) => (typeof prefix === 'function' ? prefix(i) : prefix);
        const pattern = typeof prefix === 'function' ? /^\d+\.\s/ : new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
        const allHave = lines.every((l) => pattern.test(l));
        const next = lines
            .map((l, i) => (allHave ? l.replace(pattern, '') : `${getPrefix(i)}${l.replace(/^(#{1,6}\s|>\s|[-*+]\s|\d+\.\s)/, '')}`))
            .join('\n');
        replaceRange(lineStart, lineEnd, next, 0, next.length);
    };

    const insertBlock = (block: string, selectFrom?: number, selectTo?: number) => {
        const { start, end, value: v } = getSelection();
        const needsLeadingBreak = start > 0 && !v.slice(0, start).endsWith('\n\n');
        const lead = needsLeadingBreak ? (v.slice(0, start).endsWith('\n') ? '\n' : '\n\n') : '';
        const text = `${lead}${block}\n\n`;
        replaceRange(
            start,
            end,
            text,
            selectFrom !== undefined ? lead.length + selectFrom : undefined,
            selectTo !== undefined ? lead.length + selectTo : undefined,
        );
    };

    const insertLink = () => {
        const { start, end, text } = getSelection();
        const label = text || 'link text';
        const snippet = `[${label}](https://)`;
        const urlStart = label.length + 3;
        replaceRange(start, end, snippet, urlStart, urlStart + 'https://'.length);
    };

    const insertCodeBlock = () => {
        const { text } = getSelection();
        const code = text || 'code here';
        insertBlock('```ts\n' + code + '\n```', 6, 6 + code.length);
    };

    const insertTable = () => {
        insertBlock('| Column | Column |\n| ------ | ------ |\n| Cell   | Cell   |');
    };

    const uploadImages = async (files: File[]) => {
        const images = files.filter((f) => f.type.startsWith('image/'));
        if (!images.length) return;
        setError(null);

        for (const file of images) {
            const token = `![Uploading ${file.name.replace(/[[\]]/g, '')}…](${Math.random().toString(36).slice(2)})`;
            const { start, end } = getSelection();
            replaceRange(start, end, `${token}\n`);
            setUploads((n) => n + 1);

            try {
                const url = await portfolioService.uploadBlogImage(file);
                const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/[[\]]/g, '');
                swapToken(token, `![${alt}](${url})`);
            } catch (err: any) {
                swapToken(token, '');
                setError(err?.message || 'Image upload failed');
            } finally {
                setUploads((n) => n - 1);
            }
        }
    };

    const swapToken = (token: string, replacement: string) => {
        const el = textareaRef.current;
        if (!el) return;
        const idx = el.value.indexOf(token);
        if (idx === -1) return;
        const { selectionStart, selectionEnd } = el;
        replaceRange(idx, idx + token.length, replacement);
        // Keep the user's cursor where it was if they kept typing during the upload
        const shift = replacement.length - token.length;
        requestAnimationFrame(() => {
            const s = selectionStart > idx ? selectionStart + shift : selectionStart;
            const e = selectionEnd > idx ? selectionEnd + shift : selectionEnd;
            el.setSelectionRange(s, e);
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const mod = e.metaKey || e.ctrlKey;
        if (mod && e.key.toLowerCase() === 'b') { e.preventDefault(); wrap('**', '**', 'bold text'); return; }
        if (mod && e.key.toLowerCase() === 'i') { e.preventDefault(); wrap('*', '*', 'italic text'); return; }
        if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); insertLink(); return; }

        // Continue lists on Enter; an empty list item ends the list
        if (e.key === 'Enter' && !e.shiftKey && !mod) {
            const { start, end, value: v } = getSelection();
            if (start !== end) return;
            const lineStart = v.lastIndexOf('\n', start - 1) + 1;
            const line = v.slice(lineStart, start);
            const m = line.match(/^(\s*)([-*+]|(\d+)\.)\s(\[[ xX]\]\s)?(.*)$/);
            if (!m) return;
            e.preventDefault();
            if (!m[5].trim()) {
                replaceRange(lineStart, start, '');
                return;
            }
            const marker = m[3] ? `${parseInt(m[3], 10) + 1}.` : m[2];
            const checkbox = m[4] ? '[ ] ' : '';
            replaceRange(start, end, `\n${m[1]}${marker} ${checkbox}`);
        }
    };

    const tools: { icon: React.ReactNode; label: string; action: () => void }[][] = [
        [
            { icon: <Heading2 size={16} />, label: 'Heading', action: () => prefixLines('## ') },
            { icon: <Heading3 size={16} />, label: 'Subheading', action: () => prefixLines('### ') },
        ],
        [
            { icon: <Bold size={16} />, label: 'Bold (⌘B)', action: () => wrap('**', '**', 'bold text') },
            { icon: <Italic size={16} />, label: 'Italic (⌘I)', action: () => wrap('*', '*', 'italic text') },
            { icon: <Strikethrough size={16} />, label: 'Strikethrough', action: () => wrap('~~', '~~', 'text') },
            { icon: <Link2 size={16} />, label: 'Link (⌘K)', action: insertLink },
        ],
        [
            { icon: <Quote size={16} />, label: 'Quote', action: () => prefixLines('> ') },
            { icon: <List size={16} />, label: 'Bullet list', action: () => prefixLines('- ') },
            { icon: <ListOrdered size={16} />, label: 'Numbered list', action: () => prefixLines((i) => `${i + 1}. `) },
        ],
        [
            { icon: <Code size={16} />, label: 'Inline code', action: () => wrap('`', '`', 'code') },
            { icon: <Code2 size={16} />, label: 'Code block', action: insertCodeBlock },
            { icon: <Table size={16} />, label: 'Table', action: insertTable },
            { icon: <Minus size={16} />, label: 'Divider', action: () => insertBlock('---') },
            { icon: <ImagePlus size={16} />, label: 'Insert image', action: () => fileInputRef.current?.click() },
        ],
    ];

    const words = countWords(value);
    const modes: { id: ViewMode; label: string; icon: React.ReactNode; className?: string }[] = [
        { id: 'write', label: 'Write', icon: <Pencil size={14} /> },
        { id: 'split', label: 'Split', icon: <Columns size={14} />, className: 'hidden lg:flex' },
        { id: 'preview', label: 'Preview', icon: <Eye size={14} /> },
    ];

    return (
        <div className="border-4 border-neutral-200 dark:border-neutral-800 focus-within:border-accent transition-colors">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-primary px-2 py-2">
                <div className={`flex flex-wrap items-center gap-1 ${mode === 'preview' ? 'opacity-30 pointer-events-none' : ''}`}>
                    {tools.map((group, gi) => (
                        <React.Fragment key={gi}>
                            {gi > 0 && <span className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-1" />}
                            {group.map((tool) => (
                                <button
                                    key={tool.label}
                                    type="button"
                                    title={tool.label}
                                    aria-label={tool.label}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={tool.action}
                                    className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-900 dark:hover:bg-accent transition-colors"
                                >
                                    {tool.icon}
                                </button>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
                <div className="flex border-2 border-neutral-200 dark:border-neutral-800">
                    {modes.map((m) => (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => setMode(m.id)}
                            className={`${m.className || 'flex'} items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                                mode === m.id ? 'bg-neutral-900 text-white dark:bg-accent' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                            }`}
                        >
                            {m.icon}
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Editor / preview */}
            <div className={`grid ${mode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                <div
                    className={`relative ${mode === 'preview' ? 'hidden' : ''}`}
                    onDragOver={(e) => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); setDragOver(true); } }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                        if (!e.dataTransfer.files.length) return;
                        e.preventDefault();
                        setDragOver(false);
                        uploadImages(Array.from(e.dataTransfer.files));
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={(e) => {
                            const files = Array.from(e.clipboardData.files);
                            if (files.some((f) => f.type.startsWith('image/'))) {
                                e.preventDefault();
                                uploadImages(files);
                            }
                        }}
                        placeholder={placeholder}
                        spellCheck
                        className="block w-full min-h-[520px] h-[60vh] bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white px-6 py-6 font-mono text-sm leading-7 focus:outline-none resize-y"
                    />
                    {dragOver && (
                        <div className="absolute inset-0 border-4 border-dashed border-accent bg-accent/10 flex items-center justify-center pointer-events-none">
                            <p className="text-xs font-black uppercase tracking-widest text-accent">Drop image to upload</p>
                        </div>
                    )}
                </div>
                {mode !== 'write' && (
                    <div className={`bg-white dark:bg-primary px-6 md:px-10 py-8 overflow-y-auto ${mode === 'split' ? 'h-[60vh] min-h-[520px] lg:border-l-4 border-neutral-200 dark:border-neutral-800' : 'min-h-[520px]'}`}>
                        {value.trim() ? (
                            <MarkdownContent content={value} />
                        ) : (
                            <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Nothing to preview yet.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Status bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t-4 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-primary px-4 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                <span className="flex items-center gap-3">
                    {uploads > 0 && (
                        <span className="flex items-center gap-2 text-accent">
                            <Loader2 size={12} className="animate-spin" /> Uploading {uploads} image{uploads > 1 ? 's' : ''}…
                        </span>
                    )}
                    {error && <span className="text-red-500">{error}</span>}
                    {!uploads && !error && <span>Markdown · paste or drop images to upload</span>}
                </span>
                <span>{words.toLocaleString()} words · ~{Math.max(1, Math.round(words / 230))} min read</span>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                    uploadImages(Array.from(e.target.files || []));
                    e.target.value = '';
                }}
            />
        </div>
    );
}
