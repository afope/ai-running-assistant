'use client';

import React from 'react';

interface MarkdownTextProps {
  text: string;
}

export function MarkdownText({ text }: MarkdownTextProps) {
  // Split text into lines for processing
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let inList = false;
  let lastWasBreak = false;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-2 my-4 ml-6">
          {currentList.map((item, idx) => {
            // Check if item has sub-bullets (starts with * or - after some text)
            const subBulletMatch = item.match(/^(.+?):\s*\* (.+)$/);
            if (subBulletMatch) {
              return (
                <li key={idx} className="text-sm">
                  <span className="font-semibold">{formatInlineMarkdown(subBulletMatch[1])}:</span>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li className="text-sm text-black/70 dark:text-white/70">{formatInlineMarkdown(subBulletMatch[2])}</li>
                  </ul>
                </li>
              );
            }
            return (
              <li key={idx} className="text-sm leading-relaxed">
                {formatInlineMarkdown(item)}
              </li>
            );
          })}
        </ul>
      );
      currentList = [];
      inList = false;
    }
  };

  const formatInlineMarkdown = (line: string): React.ReactNode => {
    if (!line) return null;
    
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    
    // Match bold text **text** - improved regex to handle multiple bold sections
    const boldRegex = /\*\*([^*]+?)\*\*/g;
    const matches: Array<{ start: number; end: number; text: string }> = [];
    let match;
    
    // Reset regex lastIndex to avoid issues with global regex
    boldRegex.lastIndex = 0;
    
    while ((match = boldRegex.exec(line)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[1],
      });
    }
    
    if (matches.length === 0) {
      return <span>{line}</span>;
    }
    
    matches.forEach((m, idx) => {
      // Add text before match
      if (m.start > currentIndex) {
        const beforeText = line.substring(currentIndex, m.start);
        if (beforeText) {
          parts.push(<span key={`text-${idx}`}>{beforeText}</span>);
        }
      }
      // Add bold text
      parts.push(<strong key={`bold-${idx}`} className="font-bold">{m.text}</strong>);
      currentIndex = m.end;
    });
    
    // Add remaining text
    if (currentIndex < line.length) {
      const remainingText = line.substring(currentIndex);
      if (remainingText) {
        parts.push(<span key="text-end">{remainingText}</span>);
      }
    }
    
    return <>{parts}</>;
  };

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim();
    
    // Handle headers
    if (trimmed.startsWith('## ')) {
      flushList();
      lastWasBreak = false;
      elements.push(
        <h3 key={`h3-${lineIndex}`} className="text-lg font-bold mt-6 mb-3 uppercase tracking-wider" style={{ fontFamily: 'var(--font-adi)' }}>
          {formatInlineMarkdown(trimmed.substring(3))}
        </h3>
      );
      return;
    }
    
    if (trimmed.startsWith('### ')) {
      flushList();
      lastWasBreak = false;
      elements.push(
        <h4 key={`h4-${lineIndex}`} className="text-base font-bold mt-4 mb-2 uppercase tracking-wider" style={{ fontFamily: 'var(--font-adi)' }}>
          {formatInlineMarkdown(trimmed.substring(4))}
        </h4>
      );
      return;
    }
    
    // Handle bullet lists
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      if (!inList) {
        flushList();
        inList = true;
      }
      currentList.push(trimmed.substring(2).trim());
      return;
    }
    
    // Handle numbered lists
    const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch) {
      if (!inList) {
        flushList();
        inList = true;
      }
      currentList.push(numberedMatch[1]);
      return;
    }
    
    // Handle horizontal rules
    if (trimmed === '---' || trimmed === '***') {
      flushList();
      lastWasBreak = false;
      elements.push(
        <hr key={`hr-${lineIndex}`} className="my-4 border-black/10 dark:border-white/10" />
      );
      return;
    }
    
    // Regular paragraph
    if (trimmed) {
      flushList();
      lastWasBreak = false;
      // Check if line contains a colon and might be a definition list item
      if (trimmed.includes(':') && trimmed.length < 100) {
        const [term, ...defParts] = trimmed.split(':');
        const definition = defParts.join(':').trim();
        elements.push(
          <p key={`p-${lineIndex}`} className="mb-2 leading-relaxed">
            <span className="font-semibold">{formatInlineMarkdown(term.trim())}:</span>
            {definition && <span className="ml-1">{formatInlineMarkdown(definition)}</span>}
          </p>
        );
      } else {
        elements.push(
          <p key={`p-${lineIndex}`} className="mb-3 leading-relaxed text-sm">
            {formatInlineMarkdown(trimmed)}
          </p>
        );
      }
    } else {
      // Empty line - flush list and add spacing
      flushList();
      // Add spacing for empty lines (avoid consecutive breaks)
      if (!lastWasBreak) {
        elements.push(<br key={`br-${lineIndex}`} />);
        lastWasBreak = true;
      }
    }
  });
  
  flushList(); // Flush any remaining list items

  return <div className="markdown-content">{elements}</div>;
}
