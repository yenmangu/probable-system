import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Note } from './note.model';
// import { NoteStorageService } from './note-storage.service';

@Injectable({
	providedIn: 'root'
})
export class NotesService {
	private noteSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);

	notes$ = this.noteSubject.asObservable();

	notes: Note[] = new Array<Note>();

	orderedArray: Note[] = [];

	// use constructor in Note model to define note type
	private storedNotes: { [id: string]: Note } = {};
	private noteArray: Note[] = [];

	private localStorageKey = 'notes';

	constructor() {
		this.initialiseNotes();
	}

	private initialiseNotes(): void {
		this.refreshNotes();
	}

	private getNotekey(noteId: string): string {
		return `${this.localStorageKey}_${noteId}`;
	}

	private findNoteKeys(): string[] {
		let keyArray = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith(this.localStorageKey)) {
				keyArray.push(key);
			}
		}
		return keyArray;
	}

	private retrieveFromLocal(): any {
		const keysToUse = this.findNoteKeys();
		let parsedNotes: { [id: string]: Note } = {};
		keysToUse.forEach(key => {
			const noteString = localStorage.getItem(key);
			if (noteString) {
				const note = JSON.parse(noteString);
				parsedNotes[note.id] = note;
			} else {
				parsedNotes = {};
			}
		});
		return parsedNotes;
	}

	private getOrderedNotes(parsedNotes: any): Note[] {
		const orderedArray: Note[] = Object.values(parsedNotes);
		orderedArray.sort((a, b) => b.date - a.date);
		return orderedArray;
	}

	private updateNoteSubject(data: Note[]) {
		this.noteSubject.next(data);
	}

	public refreshNotes(): void {
		const retrievedNotes = this.retrieveFromLocal();
		if (Object.keys(retrievedNotes).length > 0) {
			const orderedNotes = this.getOrderedNotes(retrievedNotes);
			this.orderedArray = orderedNotes;

			this.storedNotes = retrievedNotes;
			this.updateNoteSubject(orderedNotes);
		} else {
			console.log('no notes to refresh');
			this.storedNotes = {};
		}
	}

	private saveToLocalStorage(note: Note) {
		console.log('from saveToLocalStorage(): ', note);
		const noteStorageKey = this.getNotekey(note.id);
		localStorage.setItem(noteStorageKey, JSON.stringify(note));
	}

	private deleteFromLocalStorage(id: string): void {
		localStorage.removeItem(this.getNotekey(id));
	}

	get(id: string): Note {
		const foundNote = this.storedNotes[id];
		// return foundNote or create default Note object if not found
		return foundNote || new Note('', '');
	}

	getId(note: Note) {
		return this.notes.indexOf(note);
	}

	add(note: any) {
		const newNote = new Note(note.title, note.body);
		console.log('from notesService.add(), newNote: ', newNote);
		this.saveToLocalStorage(newNote);
	}

	// add(note: Note) {
	// 	console.log('from notesService.add(), note: ', note);
	// 	const noteObject = {[note.id]: note}
	// 	this.storedNotes.push(noteObject)

	// }

	update(id: string, title: string, body: string) {
		let note = this.storedNotes[id];
		if (note) {
			note.title = title;
			note.body = body;
			this.saveToLocalStorage(note);
			this.refreshNotes();
		} else {
			console.log('notesService detected no note');
		}
	}

	delete(id: string) {
		this.deleteFromLocalStorage(id);
		this.refreshNotes();
	}

	clearAll(): Boolean {
		let clear = false;
		localStorage.removeItem(this.localStorageKey);
		if (localStorage.getItem(this.localStorageKey) === null) {
			clear = true;
			console.log('Success clearing localStorage');
		} else {
			console.log('Error clearing localStorage');
			clear = false;
		}
		return clear;
	}
}
