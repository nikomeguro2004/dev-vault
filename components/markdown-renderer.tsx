import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { CopyCodeButton } from "@/components/copy-code-button";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-zinc-950/80">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children }) => {
            let code = "";
            const codeNode = Array.isArray(children) ? children[0] : children;

            if (
              codeNode &&
              typeof codeNode === "object" &&
              "props" in codeNode &&
              typeof codeNode.props?.children === "string"
            ) {
              code = codeNode.props.children;
            }

            return (
              <div className="relative">
                <div className="absolute right-3 top-3">
                  <CopyCodeButton code={code} />
                </div>
                <pre>{children}</pre>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
