import React, { useEffect, useRef } from 'react';

import { Textarea } from './ui/textarea';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  onBlur,
  placeholder = "What's on your mind?",
  autoFocus = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) resize();
  }, [content]);

  return (
    <Textarea
      autoComplete='off'
      autoCorrect='off'
      autoFocus={autoFocus}
      className='w-full resize-none border-none p-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0'
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      ref={textareaRef}
      value={content}
    />
  );
};
