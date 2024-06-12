import { useState } from 'react';
import { Textarea } from './components/ui/textarea';
import { Button } from './components/ui/button';

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

const Note = ({ note }: { note: Note }) => {
  const { content, createdAt } = note;

  return (
    <div className='flex items-start space-x-3 p-3 rounded-lg mb-3'>
      <div className='flex-shrink-0 text-gray-500 whitespace-nowrap'>{`[${formatTime(createdAt)}]`}</div>
      <p className='break-words'>{content}</p>
    </div>
  );
};

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState<string>('');

  return (
    <div className='max-w-4xl mx-auto p-5'>
      <div className='flex items-center mb-5'>
        <h1 className='text-2xl font-bold mr-2'>{formatDate(new Date())}</h1>
        <p className='text-lg text-gray-600'>{`(${notes.length} notes)`}</p>
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
          notes.map((note, index) => <Note key={index} note={note} />)
        ) : (
          <p className='text-center text-gray-500'>No notes yet.</p>
        )}
      </div>
    </div>
  );
};

export default App;
