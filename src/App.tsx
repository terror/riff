import { useState } from 'react';

import { Textarea } from './components/ui/textarea';
import { Button } from './components/ui/button';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

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

type Note = {
  content: string;
  createdAt: Date;
};

const formatDate = (date: Date): string => {
  const month = date.toLocaleString('en-US', { month: 'long' });
  return `${month} ${date.getDate()}, ${date.getFullYear()}`;
};

const formatTime = (date: Date): string => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let minutesString = minutes.toString();
  let ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  minutesString = minutes < 10 ? '0' + minutesString : minutesString;

  return `${hours}:${minutesString} ${ampm}`;
};

type ModalProps = {
  trigger: JSX.Element;
  title: string;
  content: string;
  action: { handler: () => void; text: string };
};

const Modal = ({ trigger, title, content, action }: ModalProps) => {
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

const Note = ({ note, onDelete }: { note: Note; onDelete: () => void }) => {
  const { content, createdAt } = note;

  return (
    <div className='relative flex items-start space-x-3 p-3 rounded-lg mb-3 group'>
      <div className='flex-shrink-0 text-gray-500 whitespace-nowrap'>{`[${formatTime(createdAt)}]`}</div>
      <div className='flex-grow pr-10'>
        <p className='text-justify break-words'>{content}</p>
      </div>
      <Modal
        trigger={
          <motion.button
            className='absolute top-2 right-2 p-1 hidden group-hover:block'
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

  return (
    <div className='max-w-4xl mx-auto p-5'>
      <div className='flex items-center mb-5'>
        <h1 className='text-2xl font-bold mr-2'>{formatDate(new Date())}</h1>
        <p className='text-lg text-gray-600'>{`(${notes.length} ${notes.length === 1 ? 'note' : 'notes'})`}</p>
      </div>
      <div className='mb-5 flex flex-col'>
        <Textarea
          value={content}
          className='w-full mb-3'
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
          className='py-2 rounded-lg shadow self-end'
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
