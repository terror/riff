import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './components/ui/alert-dialog';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { formatDateToLongString, formatTimeTo12HourString } from './lib/utils';

type Note = {
  content: string;
  createdAt: Date;
};

type AlertProps = {
  trigger: JSX.Element;
  title: string;
  content: string;
  action: { handler: () => void; text: string };
};

const Alert = ({ trigger, title, content, action }: AlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{content}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={action.handler}>
            {action.text}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const Note = ({
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

  const startEditing = () => {
    setEditContent(content);
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editContent);
    setIsEditing(false);
  };

  return (
    <div className='group relative mb-3 flex items-start space-x-3 rounded-lg p-3'>
      <div className='flex-shrink-0 whitespace-nowrap text-gray-500'>{`[${formatTimeTo12HourString(createdAt)}]`}</div>
      <div className='flex-grow pr-10'>
        {isEditing ? (
          <Textarea
            value={editContent}
            className='w-full'
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSave}
            autoFocus
          />
        ) : (
          <p className='break-words text-justify' onClick={startEditing}>
            {content}
          </p>
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

  return (
    <div className='mx-auto max-w-4xl p-5'>
      <div className='mb-5 flex items-center'>
        <h1 className='mr-2 text-2xl font-bold'>
          {formatDateToLongString(new Date())}
        </h1>
        <p className='text-lg text-gray-600'>{`(${notes.length} ${notes.length === 1 ? 'note' : 'notes'})`}</p>
      </div>
      <div className='mb-5 flex flex-col'>
        <Textarea
          value={content}
          className='mb-3 w-full'
          onChange={(e) => setContent(e.target.value)}
          placeholder='Type your note here...'
        />
        <Button
          onClick={() => {
            if (content.trim()) {
              setNotes([{ content, createdAt: new Date() }, ...notes]);
              setContent('');
            }
          }}
          className='self-end rounded-lg py-2 shadow'
        >
          Publish
        </Button>
      </div>
      <div>
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <Note
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
