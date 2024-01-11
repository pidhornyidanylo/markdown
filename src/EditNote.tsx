import NoteForm from "./NoteForm"
import { Tag, NoteData } from "./App"
import { useNote } from "./NoteLayout"

type EditNoteProps = {
    onUpdateNote: (id: string, data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

const EditNote = ({ onUpdateNote, onAddTag, availableTags }: EditNoteProps) => {
    const note = useNote()
    return (
        <>
            <h1 className='mn-4'>Edit Note</h1>
            <NoteForm
                title={note.title}
                markdown={note.markdown}
                tags={note.tags}
                onSubmit={data => onUpdateNote(note.id, data)}
                onAddTag={onAddTag}
                availableTags={availableTags}
            />
        </>
    )
}

export default EditNote
