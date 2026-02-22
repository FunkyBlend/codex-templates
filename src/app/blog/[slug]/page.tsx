import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { blogPosts } from '@/lib/data';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { notFound } from 'next/navigation';

const difficultyColors = {
  basic: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-red-500/20 text-red-400',
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/blog" className="inline-flex items-center gap-1 text-dark-muted hover:text-dark-text text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to blog
      </Link>

      <article>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`badge ${difficultyColors[post.difficulty]} text-[10px]`}>
              {post.difficulty}
            </span>
            <span className="text-dark-muted text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-dark-text mb-3">{post.title}</h1>
          <p className="text-dark-muted leading-relaxed">{post.excerpt}</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold text-dark-text mt-8 mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-semibold text-dark-text mt-6 mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-medium text-dark-text mt-4 mb-2">{children}</h3>,
              p: ({ children }) => <p className="text-dark-muted leading-relaxed mb-4">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside text-dark-muted mb-4 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside text-dark-muted mb-4 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-dark-muted">{children}</li>,
              a: ({ href, children }) => <a href={href} className="text-accent-green hover:underline">{children}</a>,
              strong: ({ children }) => <strong className="text-dark-text font-semibold">{children}</strong>,
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full border-collapse border border-dark-border">{children}</table>
                </div>
              ),
              th: ({ children }) => <th className="border border-dark-border bg-dark-card px-4 py-2 text-left text-sm text-dark-text">{children}</th>,
              td: ({ children }) => <td className="border border-dark-border px-4 py-2 text-sm text-dark-muted">{children}</td>,
              code: ({ className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                return isInline ? (
                  <code className="bg-dark-card px-1.5 py-0.5 rounded text-accent-green text-sm font-mono" {...props}>
                    {children}
                  </code>
                ) : (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-lg mb-4 !bg-dark-card border border-dark-border"
                    customStyle={{ background: '#161b22', fontSize: '13px' }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
