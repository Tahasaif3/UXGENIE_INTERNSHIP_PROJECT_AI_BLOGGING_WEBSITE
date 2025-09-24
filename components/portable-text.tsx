import { PortableText, PortableTextComponents } from '@portabletext/react';
import { urlFor } from '@/lib/sanity';

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="font-heading text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="font-heading text-2xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="font-heading text-xl font-semibold mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="font-heading text-lg font-semibold mt-4 mb-2">{children}</h4>,
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-secondary pl-4 italic my-6 text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-4 pl-6 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="mb-4 pl-6 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{children}</code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-primary underline hover:no-underline"
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => (
      <div className="my-8">
        <img
          src={urlFor(value)}
          // src={urlFor(value).url()}
          alt={value.alt || ''}
          className="w-full h-auto rounded-lg"
        />
        {value.caption && (
          <p className="text-sm text-muted-foreground text-center mt-2">{value.caption}</p>
        )}
      </div>
    ),
    code: ({ value }) => (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
        <code className="text-sm font-mono">{value.code}</code>
      </pre>
    ),
  },
};

interface PortableTextRendererProps {
  content: any[];
}

export function PortableTextRenderer({ content }: PortableTextRendererProps) {
  if (!content || !Array.isArray(content)) {
    return <p className="text-muted-foreground">No content available</p>;
  }

  return <PortableText value={content} components={components} />;
}