import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Shared renderer so the admin preview looks exactly like the public post
export const proseClasses = `prose prose-neutral dark:prose-invert prose-lg md:prose-xl max-w-none
  prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
  prose-p:font-medium prose-p:leading-relaxed prose-p:text-neutral-600 dark:prose-p:text-neutral-400
  prose-li:text-neutral-600 dark:prose-li:text-neutral-400
  prose-a:text-accent prose-a:no-underline hover:prose-a:underline
  prose-strong:font-black prose-strong:text-neutral-900 dark:prose-strong:text-white
  prose-code:before:content-none prose-code:after:content-none prose-code:bg-neutral-100 dark:prose-code:bg-neutral-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-semibold
  prose-pre:bg-neutral-900 prose-pre:border-4 prose-pre:border-neutral-900 dark:prose-pre:border-neutral-800 prose-pre:rounded-none
  prose-img:border-4 prose-img:border-neutral-900 dark:prose-img:border-neutral-800
  prose-blockquote:border-l-8 prose-blockquote:border-accent prose-blockquote:bg-neutral-50 dark:prose-blockquote:bg-neutral-900 prose-blockquote:p-8 prose-blockquote:font-bold prose-blockquote:not-italic`;

export default function MarkdownContent({ content, className = '' }: { content: string; className?: string }) {
  return (
    <div className={`${proseClasses} ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
