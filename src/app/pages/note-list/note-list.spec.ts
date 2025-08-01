import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteListComponent } from './note-list';
import { NoteService } from '../../services/note';
import { of, throwError } from 'rxjs';
import { Note } from '../../services/note';

const mockNotes: Note[] = [
  { id: 1, title: 'Nota 1', description: 'Descripción 1' },
  { id: 2, title: 'Nota 2', description: 'Descripción 2' }
];

class MockNoteService {
  getAll = jasmine.createSpy().and.returnValue(of(mockNotes));
  delete = jasmine.createSpy().and.returnValue(of(undefined));
}

describe('NoteListComponent', () => {
  let component: NoteListComponent;
  let fixture: ComponentFixture<NoteListComponent>;
  let mockNoteService: MockNoteService;

  beforeEach(async () => {
    mockNoteService = new MockNoteService();

    await TestBed.configureTestingModule({
      imports: [NoteListComponent],
      providers: [{ provide: NoteService, useValue: mockNoteService }]
    }).compileComponents();

    fixture = TestBed.createComponent(NoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  afterEach(() => {
    mockNoteService.getAll.calls.reset();
    mockNoteService.delete.calls.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load notes on init', () => {
    expect(mockNoteService.getAll).toHaveBeenCalled();
    expect(component.notes()).toEqual(mockNotes);
  });

  it('should reload notes after note creation', () => {
    component.onNoteCreated();
    expect(mockNoteService.getAll).toHaveBeenCalledTimes(2); // ngOnInit + onNoteCreated
  });

  it('should reset noteToEdit and reload notes on update', () => {
    component.noteToEdit.set({ id: 99, title: 'x', description: 'y' });
    component.onNoteUpdated();
    expect(component.noteToEdit()).toBeNull();
    expect(mockNoteService.getAll).toHaveBeenCalledTimes(2);
  });

  it('should set noteToEdit when onEditNote is called', () => {
    const note: Note = { id: 3, title: 'Edit me', description: 'Editing' };
    component.onEditNote(note);
    expect(component.noteToEdit()).toEqual(note);
  });

  it('should call delete and reload notes on successful delete', () => {
    component.onDeleteNote(1);
    expect(mockNoteService.delete).toHaveBeenCalledWith(1);
    expect(mockNoteService.getAll).toHaveBeenCalledTimes(2); // ngOnInit + onDeleteNote
  });

  it('should log error if getAll fails', () => {
    spyOn(console, 'error');
    mockNoteService.getAll.and.returnValue(throwError(() => new Error('Load failed')));

    component.loadNotes();

    expect(console.error).toHaveBeenCalledWith(
      'Error',
      jasmine.any(Error)
    );
  });

  it('should log error if delete fails', () => {
    spyOn(console, 'error');
    mockNoteService.delete.and.returnValue(throwError(() => new Error('Delete failed')));

    component.onDeleteNote(999);

    expect(console.error).toHaveBeenCalledWith(
      'Error',
      jasmine.any(Error)
    );
  });
});
