import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Note, NoteService} from '../../services/note';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: 'note-form.html',
  styleUrls: ['note-form.scss']
})
export class NoteFormComponent {
  @Output() noteCreated = new EventEmitter<void>();

  noteForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly noteService: NoteService
  ) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.noteForm.invalid) return;

    const {title, description} = this.noteForm.value;

    this.noteService.create({title, description} as Note).subscribe({
      next: () => {
        this.noteForm.reset();
        this.noteCreated.emit();
      },
      error: (err) => console.error('Error al crear nota', err)
    });
  }
}
