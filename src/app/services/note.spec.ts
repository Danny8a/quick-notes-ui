import { TestBed } from '@angular/core/testing';
import { NoteService, Note } from './note';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('NoteService', () => {
  let service: NoteService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/notes';

  const mockNotes: Note[] = [
    { id: 1, title: 'Nota 1', description: 'Descripción 1' },
    { id: 2, title: 'Nota 2', description: 'Descripción 2' }
  ];

  const newNote: Note = { id: 3, title: 'Nueva nota', description: 'Nueva descripción' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NoteService]
    });

    service = TestBed.inject(NoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no queden requests pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all notes', () => {
    service.getAll().subscribe(notes => {
      expect(notes).toEqual(mockNotes);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockNotes);
  });

  it('should create a new note', () => {
    service.create(newNote).subscribe(note => {
      expect(note).toEqual(newNote);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newNote);
    req.flush(newNote);
  });

  it('should update an existing note', () => {
    const updatedNote: Note = { ...newNote, title: 'Actualizado' };

    expect(updatedNote.id).toBeDefined();

    service.update(updatedNote.id!, updatedNote).subscribe(note => {
      expect(note).toEqual(updatedNote);
    });

    const req = httpMock.expectOne(`${apiUrl}/${updatedNote.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedNote);
    req.flush(updatedNote);
  });

});
