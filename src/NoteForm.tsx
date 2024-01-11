import { FormEvent, useRef, useState } from 'react'
import { Form, Stack, Row, Col, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap'
import CreatableReactSelect from 'react-select/creatable'
import { Link, useNavigate } from 'react-router-dom'
import { NoteData, Tag } from './App'
import { v4 as uuidV4 } from 'uuid'


type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
} & Partial<NoteData>

const NoteForm = ({ onSubmit, onAddTag, availableTags, title = "", markdown= "", tags=[] }: NoteFormProps) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
    const navigate = useNavigate()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({
            title: titleRef.current!.value,
            markdown: textareaRef.current!.value,
            tags: selectedTags
        })
        navigate("..")
    }
    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <FormGroup controlId='title'>
                            <FormLabel>Title</FormLabel>
                            <FormControl ref={titleRef} required defaultValue={title} />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup controlId='tags'>
                            <FormLabel>Tags</FormLabel>
                            <CreatableReactSelect
                                onCreateOption={label => {
                                    const newTag = { id: uuidV4(), label }
                                    onAddTag(newTag)
                                    setSelectedTags(prev => [...prev, newTag])
                                }}
                                value={selectedTags.map(t => {
                                    return { label: t.label, value: t.id }
                                })}
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { label: tag.label, id: tag.value }
                                    }))
                                }}
                            isMulti />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup controlId='markdown'>
                            <FormLabel>Body</FormLabel>
                            <FormControl ref={textareaRef} required as="textarea" rows={15} defaultValue={markdown} />
                        </FormGroup>
                        <Stack direction='horizontal' gap={2} className='justify-content-end mt-4'>
                            <Button type='submit' variant='primary'>Save</Button>
                            <Link to="..">
                                <Button type='button' variant='outline-secondary'>Cancel</Button>
                            </Link>
                        </Stack>
                    </Col>
                </Row>
            </Stack>
        </Form>
    )
}

export default NoteForm
