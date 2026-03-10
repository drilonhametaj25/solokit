"use client";

import ReactMarkdown from "react-markdown";
import { slugify } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-invert prose-lg mx-auto max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => {
            const text = getTextContent(children);
            const id = slugify(text);
            return (
              <h1 id={id}>
                <a href={`#${id}`} className="no-underline">
                  {children}
                </a>
              </h1>
            );
          },
          h2: ({ children }) => {
            const text = getTextContent(children);
            const id = slugify(text);
            return (
              <h2 id={id}>
                <a href={`#${id}`} className="no-underline">
                  {children}
                </a>
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = getTextContent(children);
            const id = slugify(text);
            return (
              <h3 id={id}>
                <a href={`#${id}`} className="no-underline">
                  {children}
                </a>
              </h3>
            );
          },
          a: ({ href, children }) => {
            const isExternal =
              href?.startsWith("http") || href?.startsWith("//");
            if (isExternal) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              );
            }
            return <a href={href}>{children}</a>;
          },
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || ""}
              className="rounded-xl"
              loading="lazy"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function getTextContent(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(getTextContent).join("");
  if (children && typeof children === "object" && "props" in children) {
    return getTextContent((children as React.ReactElement).props.children);
  }
  return String(children ?? "");
}
