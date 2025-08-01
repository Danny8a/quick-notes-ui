import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteFormComponent } from './note-form';
import { ReactiveFormsModule } from '@angular/forms';
import { NoteService } from '../../services/note';
import { of, throwError } from 'rxjs';

class MockNoteService {
  create = jasmine.createSpy().and.returnValue(of(undefined));
}

describe('NoteFormComponent', () => {
  let component: NoteFormComponent;
  let fixture: ComponentFixture<NoteFormComponent>;
  let mockNoteService: MockNoteService;

  beforeEach(async () => {
    mockNoteService = new MockNoteService();

    await TestBed.configureTestingModule({
      imports: [NoteFormComponent, ReactiveFormsModule],
      providers: [{ provide: NoteService, useValue: mockNoteService }]
    }).compileComponents();

    fixture = TestBed.createComponent(NoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockNoteService.create.calls.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.noteForm.setValue({ title: '', description: '' });
    component.onSubmit();
    expect(mockNoteService.create).not.toHaveBeenCalled();
  });

  it('should call create on NoteService and emit noteCreated on success', () => {
    spyOn(component.noteCreated, 'emit');

    component.noteForm.setValue({ title: 'Nueva nota', description: 'Descripción' });
    component.onSubmit();

    expect(mockNoteService.create).toHaveBeenCalledWith({
      title: 'Nueva nota',
      description: 'Descripción'
    });
    expect(component.noteForm.value).toEqual({ title: null, description: null });
    expect(component.noteCreated.emit).toHaveBeenCalled();
  });

  it('should log an error if create fails', () => {
    spyOn(console, 'error');
    mockNoteService.create.and.returnValue(throwError(() => new Error('Error al guardar')));

    component.noteForm.setValue({ title: 'Error', description: 'Fallará' });
    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith(
      'Error',
      jasmine.any(Error)
    );
  });
});
