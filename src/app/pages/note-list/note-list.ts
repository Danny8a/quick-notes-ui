import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService, Note } from '../../services/note';
import { NoteCardComponent } from '../../components/note-card/note-card';
import { NoteFormComponent } from '../note-form/note-form';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, NoteCardComponent, NoteFormComponent],
  templateUrl: 'note-list.html',
  styleUrls: ['note-list.scss']
})
export class NoteListComponent implements OnInit {
  notes = signal<Note[]>([]);
  noteToEdit = signal<Note | null>(null);

  constructor(private readonly noteService: NoteService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.noteService.getAll().subscribe({
      next: (data) => this.notes.set(data),
      error: (err) => console.error('Error al cargar notas', err)
    });
  }

  onNoteCreated(): void {
    this.loadNotes();
  }

  onNoteUpdated(): void {
    this.noteToEdit.set(null);
    this.loadNotes();
  }

  onDeleteNote(id: number): void {
    this.noteService.delete(id).subscribe({
      next: () => this.loadNotes(),
      error: (err) => console.error('Error al eliminar nota', err)
    });
  }
}
