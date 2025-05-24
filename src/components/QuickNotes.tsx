import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { format } from 'date-fns';

interface Note {
  id: string;
  content: string;
  createdAt: Date;
}

export default function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    if (!auth.currentUser) return;
    
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', auth.currentUser.uid)
    );
    
    const querySnapshot = await getDocs(q);
    const loadedNotes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      content: doc.data().content,
      createdAt: doc.data().createdAt.toDate(),
    }));
    
    setNotes(loadedNotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !auth.currentUser) return;

    try {
      const noteRef = await addDoc(collection(db, 'notes'), {
        content: newNote,
        createdAt: new Date(),
        userId: auth.currentUser.uid,
      });

      setNotes([
        {
          id: noteRef.id,
          content: newNote,
          createdAt: new Date(),
        },
        ...notes,
      ]);
      
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold">Quick Notes</h2>
      
      <form onSubmit={addNote} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a quick note..."
            className="flex-1 rounded-md border bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>

      <div className="max-h-60 space-y-2 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex items-center justify-between rounded-md bg-gray-50 p-2 dark:bg-gray-700"
          >
            <div className="flex flex-col">
              <p className="text-sm">{note.content}</p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {format(note.createdAt, 'MMM d, yyyy HH:mm')}
              </span>
            </div>
            <button
              onClick={() => deleteNote(note.id)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}