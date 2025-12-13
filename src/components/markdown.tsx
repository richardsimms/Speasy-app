'use client';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/libs/utils';

type MarkdownProps = {
  content: string;
  className?: string;
};

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn('prose prose-invert prose-lg max-w-none overflow-x-hidden break-words', className)}>
      <ReactMarkdown
        components={{
          h1: ({ className, children, ...props }) => (
            <h1
              className={cn(
                'text-3xl font-bold tracking-tight mt-8 mb-4 text-white',
                className,
              )}
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ className, children, ...props }) => (
            <h2
              className={cn(
                'text-2xl font-bold tracking-tight mt-8 mb-4 text-white',
                className,
              )}
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ className, children, ...props }) => (
            <h3
              className={cn(
                'text-xl font-bold tracking-tight mt-6 mb-3 text-white',
                className,
              )}
              {...props}
            >
              {children}
            </h3>
          ),
          p: ({ className, children, ...props }) => (
            <p
              className={cn(
                'leading-relaxed text-white/90 mb-4 break-words overflow-wrap-anywhere',
                className,
              )}
              {...props}
            >
              {children}
            </p>
          ),
          ul: ({ className, children, ...props }) => (
            <ul
              className={cn('list-disc list-outside pl-6 mb-4', className)}
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ className, children, ...props }) => (
            <ol
              className={cn('list-decimal list-outside pl-6 mb-4', className)}
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ className, children, ...props }) => (
            <li
              className={cn(
                'leading-relaxed text-white/90 mt-2 break-words overflow-wrap-anywhere',
                className,
              )}
              {...props}
            >
              {children}
            </li>
          ),
          a: ({ className, children, ...props }) => (
            <a
              className={cn(
                'font-medium text-white/90 hover:text-white underline underline-offset-4 transition-colors break-words overflow-wrap-anywhere',
                className,
              )}
              {...props}
            >
              {children}
            </a>
          ),
          blockquote: ({ className, children, ...props }) => (
            <blockquote
              className={cn('border-white/10 pl-4 italic text-white/90', className)}
              {...props}
            >
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => (
            <code
              className={cn(
                'bg-white/10 rounded px-1 py-0.5 text-sm break-words overflow-wrap-anywhere',
                className,
              )}
              {...props}
            >
              {children}
            </code>
          ),
          pre: ({ className, children, ...props }) => (
            <pre
              className={cn(
                'bg-muted p-4 rounded-md overflow-x-auto max-w-full',
                className,
              )}
              {...props}
            >
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
