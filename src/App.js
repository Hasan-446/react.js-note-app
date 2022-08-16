import React from "react";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
import Split from "react-split";
import { nanoid } from "nanoid";

function App() {
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
    );
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  );

  React.useEffect(()=>{
    localStorage.setItem("notes",JSON.stringify(notes))
  },[notes])

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "write something",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
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

    // running code without arrange the array into the top updated one
    // setNotes((oldNotes) =>
    //   oldNotes.map((oldNote) => {
    //     return oldNote.id === currentNoteId
    //       ? { ...oldNote, body: text }
    //       : oldNote;
    //   })
    // );
  
  function deleteNote(event, noteId){
    event.stopPropagation ()
    setNotes(oldNotes=> oldNotes.filter(note => note.id !== noteId))
  }
  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split className="split" sizes={[20, 80]} direction="horizontal">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && 
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          }
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
