import { Routes, Route, Navigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import NewNote from "./NewNote"
import { NoteList } from "./NoteList"
import { NoteLayout } from "./NoteLayout"
import Note from "./Note"
import EditNote from "./EditNote"
import { useLocalStorage } from "./useLocalStorageHook"
import { useMemo } from "react"
import { v4 as uuidV4 } from 'uuid'

export type Note = {
  id: string;
} & NoteData

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[]
}

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[]
}

export type Tag = {
  id: string;
  label: string;
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return [...prevNotes, { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }]
    })
  }

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if(note.id === id) {
          return { ...note, ...data, tagIds: tags.map(tag => tag.id) }
        } else {
          return note
        }
      })
    })
  }

  function onDeleteNote (id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  function updateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(pT => {
        if(pT.id === id) {
          return { ...tags, label }
        } else {
          return pT
        }
      })
    })
  }

  function deleteTag(id: string) {
    setTags(prev => {
      return prev.filter(tag => tag.id !== id)
    })
  }

  return (
    <Container className="my-4 bg-info p-5 br-5 rounded-2">
      <Routes>
        <Route path="/" element={<NoteList availableTags={tags} notes={notesWithTags} onUpdateTag={updateTag} onDeleteTag={deleteTag} />} />
        <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />} />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note deleteNote={onDeleteNote} />} />
          <Route path="edit" element={<EditNote onUpdateNote={onUpdateNote} onAddTag={addTag} availableTags={tags} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App
