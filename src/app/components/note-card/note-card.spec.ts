import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteCardComponent } from './note-card';
import { NoteService } from '../../services/note';
import { of, throwError } from 'rxjs';

class MockNoteService {
  update = jasmine.createSpy().and.returnValue(of(undefined));
}

describe('NoteCardComponent', () => {
  let component: NoteCardComponent;
  let fixture: ComponentFixture<NoteCardComponent>;
  let mockNoteService: MockNoteService;

  beforeEach(async () => {
    mockNoteService = new MockNoteService();

    await TestBed.configureTestingModule({
      imports: [NoteCardComponent],
      providers: [{ provide: NoteService, useValue: mockNoteService }]
    }).compileComponents();

    fixture = TestBed.createComponent(NoteCardComponent);
    component = fixture.componentInstance;
    component.id = 1;
    component.title = 'Original title';
    component.description = 'Original description';
    fixture.detectChanges();
  });

  afterEach(() => {
    mockNoteService.update.calls.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should enter edit mode when startEdit is called', () => {
    component.startEdit();
    expect(component.isEditing).toBeTrue();
    expect(component.editTitle).toBe(component.title);
    expect(component.editDescription).toBe(component.description);
  });

  it('should cancel edit mode when cancelEdit is called', () => {
    component.startEdit();
    component.cancelEdit();
    expect(component.isEditing).toBeFalse();
  });

  it('should save changes and emit noteUpdated', () => {
    spyOn(component.noteUpdated, 'emit');

    component.startEdit();
    component.editTitle = 'Updated title';
    component.editDescription = 'Updated description';
    component.saveEdit();

    expect(mockNoteService.update).toHaveBeenCalledWith(1, {
      id: 1,
      title: 'Updated title',
      description: 'Updated description'
    });
    expect(component.noteUpdated.emit).toHaveBeenCalled();
    expect(component.isEditing).toBeFalse();
  });

  it('should not call update if id is undefined', () => {
    component.id = undefined as any;
    component.saveEdit();
    expect(mockNoteService.update).not.toHaveBeenCalled();
  });

  it('should handle error when update fails', () => {
    spyOn(console, 'error');
    mockNoteService.update.and.returnValue(
      throwError(() => new Error('Update failed'))
    );

    component.editTitle = 'Error title';
    component.editDescription = 'Error description';
    component.saveEdit();

    expect(console.error).toHaveBeenCalledWith(
      'Error al actualizar nota',
      jasmine.any(Error)
    );
  });
});
