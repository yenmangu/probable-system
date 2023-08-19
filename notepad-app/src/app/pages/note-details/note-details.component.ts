import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
	selector: 'app-note-details',
	templateUrl: './note-details.component.html',
	styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {
	note!: Note;
	noteId!: string;
	isNew: boolean = true;

	constructor(
		private notesService: NotesService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		// are we creating or editing

		this.route.params.subscribe((params: Params) => {
			// debug
			if (!params['id']) {
				console.log('no id in params');
			} else {
				console.log('from noteDetailsComponent, id: ', params['id']);
			}
			const id = params['id'];
			console.log('const id = params["id"]', id);

			if (id) {
				this.note = this.notesService.get(id);
				this.noteId = id;
				this.isNew = false;
				console.log('noteDetailsComponent, this.note: ', this.note);
			} else {
				this.note = new Note('', '');
				this.isNew = true;
			}
		});
	}

	onSubmit(form: NgForm): void {
		const noteTitle = form.value.title;
		const noteBody = form.value.body;

		if (this.isNew) {
			// this.notesService.add(form.value);
			const newNote = new Note(noteTitle, noteBody);
			console.log(`newNote: ${JSON.stringify(newNote, null, 2)}`);
			this.notesService.add(newNote);
		} else {
			this.notesService.update(this.noteId, form.value.title, form.value.body);
		}
		this.router.navigateByUrl('/');

		// save note
	}

	onCancel(): void {
		this.router.navigateByUrl('/');
	}
}
