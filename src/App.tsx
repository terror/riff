import { invoke } from '@tauri-apps/api/tauri';
import { motion } from 'framer-motion';
import 'highlight.js/styles/base16/seti-ui.css';
import 'katex/dist/katex.min.css';
import { Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { toast } from 'sonner';

import { Alert } from './components/alert';
import { ModeToggle } from './components/mode-toggle';
import { Settings } from './components/settings';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import type { Config } from './lib/types';
import { formatDateToLongString, formatTimeTo12HourString } from './lib/utils';
import './styles/syntax.css';

type Note = {
  content: string;
  createdAt: Date;
};

const NoteComponent = ({
  note,
  onDelete,
  onUpdate,
}: {
  note: Note;
  onDelete: () => void;
  onUpdate: (content: string) => void;
}) => {
  const { content, createdAt } = note;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const edit = () => {
    setEditContent(content);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editContent.trim()) onUpdate(editContent);
    setIsEditing(false);
  };

  const resize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) resize();
  }, [isEditing, editContent]);

  return (
    <div className='group relative mb-3 flex items-start space-x-3 rounded-lg p-3'>
      <div className='shrink-0 whitespace-nowrap text-gray-500'>{`[${formatTimeTo12HourString(createdAt)}]`}</div>
      <div className='grow pr-10'>
        {isEditing ? (
          <Textarea
            autoComplete='off'
            autoCorrect='off'
            autoFocus
            className='w-full resize-none overflow-hidden'
            onBlur={handleSave}
            onChange={(e) => setEditContent(e.target.value)}
            ref={textareaRef}
            value={editContent}
          />
        ) : (
          <div className='prose' onClick={edit}>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeHighlight, rehypeKatex]}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      <Alert
        trigger={
          <motion.button
            className='absolute right-2 top-2 hidden p-1 group-hover:block'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ opacity: 1 }}
          >
            <Trash2 />
          </motion.button>
        }
        title='Are you sure?'
        content='This action cannot be undone. This will permanently delete your note.'
        action={{ handler: onDelete, text: 'Delete' }}
      />
    </div>
  );
};

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState<string>('');
  const [config, setConfig] = useState<Config | undefined>(undefined);

  useEffect(() => {
    invoke<Config>('load_config')
      .then((config: Config) => setConfig(config))
      .catch((error) => toast.error(`Failed to load configuration: ${error}`));
  }, []);

  if (!config) return null;

  const handleDelete = (index: number) => {
    const newNotes = [...notes];
    newNotes.splice(index, 1);
    setNotes(newNotes);
  };

  const handleUpdate = (index: number, newContent: string) => {
    const newNotes = [...notes];
    newNotes[index].content = newContent;
    setNotes(newNotes);
  };

  const handlePublish = () => {
    if (content.trim()) {
      setNotes([{ content, createdAt: new Date() }, ...notes]);
      setContent('');
    }
  };

  return (
    <div className='mx-auto max-w-4xl p-5'>
      <div className='mb-5 flex items-center'>
        <h1 className='mr-2 text-2xl font-bold'>
          {formatDateToLongString(new Date())}
        </h1>
        <p className='text-lg text-gray-600'>{`(${notes.length} ${notes.length === 1 ? 'note' : 'notes'})`}</p>
        <div className='ml-auto flex items-center space-x-2'>
          <ModeToggle />
          <Settings config={config} />
        </div>
      </div>
      <div className='mb-5 flex flex-col'>
        <Textarea
          autoComplete='off'
          autoCorrect='off'
          className='mb-3 w-full'
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          value={content}
        />
        <Button
          className='self-end rounded-lg py-2 shadow'
          onClick={handlePublish}
        >
          Publish
        </Button>
      </div>
      <div>
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <NoteComponent
              key={index}
              note={note}
              onDelete={() => handleDelete(index)}
              onUpdate={(newContent: string) => handleUpdate(index, newContent)}
            />
          ))
        ) : (
          <p className='text-center text-gray-500'>No notes yet.</p>
        )}
      </div>
    </div>
  );
};

export default App;
