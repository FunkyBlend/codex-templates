import ReactMarkdown from "react-markdown";

interface MarkdownContentProps {
  markdown: string;
}

function sanitizeMarkdown(input: string): string {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, "");
}

export function MarkdownContent({ markdown }: MarkdownContentProps) {
  const safeMarkdown = sanitizeMarkdown(markdown);

  return (
    <div className="prose prose-invert max-w-none prose-headings:text-dark-text prose-p:text-dark-text prose-a:text-accent-green prose-code:text-accent-green prose-pre:border prose-pre:border-dark-border prose-pre:bg-[#0c1118]">
      <ReactMarkdown skipHtml>{safeMarkdown}</ReactMarkdown>
    </div>
  );
}
