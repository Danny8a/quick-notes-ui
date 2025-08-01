import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-card.html',
  styleUrls: ['./note-card.scss']
})
export class NoteCardComponent {
  @Input() id!: number;
  @Input() title = '';
  @Input() description = '';
  @Output() delete = new EventEmitter<number>();
  @Output() noteUpdated = new EventEmitter<void>();

  isEditing = false;
  editTitle = '';
  editDescription = '';

  constructor(private readonly noteService: NoteService) {}

  startEdit() {
    this.isEditing = true;
    this.editTitle = this.title;
    this.editDescription = this.description;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  saveEdit() {
    if (!this.id) return;
    this.noteService.update(this.id, {
      id: this.id,
      title: this.editTitle,
      description: this.editDescription
    }).subscribe({
      next: () => {
        this.isEditing = false;
        this.noteUpdated.emit();
      },
      error: (err) => console.error('Error al actualizar nota', err)
    });
  }
}
