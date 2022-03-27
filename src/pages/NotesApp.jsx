import {useState, useEffect} from 'react'
import Sidebar from '../components/Sidebar'
import Editor from '../components/Editor'
import Split from 'react-split'
import {nanoid} from 'nanoid'
import './NotesApp.css'

export default function Notes() {
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem('notes')) || []
  )
  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0] && notes[0].id) || ''
  )
  
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])
  
  const createNewNote = () => {
    const newNote = {
      id: nanoid(),
      body: '# Type your markdown note title here'
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }
  
  const updateNote = text => {
    // Put the most recently-modified note at the top
    setNotes(oldNotes => {
      const newArray = []

      for(let i = 0; i < oldNotes.length; i++) {
        const oldNote = oldNotes[i]

        if(oldNote.id === currentNoteId) {
          newArray.unshift({ ...oldNote, body: text })
        } else {
          newArray.push(oldNote)
        }
      }

      return newArray

    })
  }
  
  const deleteNote = (event, noteId) => {
    event.stopPropagation()
    setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
  }
  
  const findCurrentNote = () => {
    return notes.find(note => {
      return note.id === currentNoteId
    }) || notes[0]
  }
  
  return (
    <section className='NotesApp'>
      <h1 className='section__title section__title--notes-app'>NOTES APP</h1>
      {
        notes.length > 0 
        ?
        <Split 
          sizes={[30, 70]} 
          direction='horizontal' 
          className='split'
        >
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {
            currentNoteId && 
            notes.length > 0 &&
            <Editor 
              currentNote={findCurrentNote()} 
              updateNote={updateNote} 
            />
          }
        </Split>
        :
        <div className='no-notes'>
          <h1>You have no notes</h1>
          <button 
            className='first-note' 
            onClick={createNewNote}
          >
            Create one now
          </button>
        </div>
      }
    </section>
  )
}
