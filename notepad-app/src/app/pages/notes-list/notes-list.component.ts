import { Component, OnInit } from '@angular/core';
import {
	trigger,
	transition,
	style,
	animate,
	query,
	stagger
} from '@angular/animations';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
	selector: 'app-notes-list',
	templateUrl: './notes-list.component.html',
	styleUrls: ['./notes-list.component.scss'],
	animations: [
		trigger('itemAnimation', [
			//
			// ENTRY ANIMATION
			transition('void => *', [
				//
				// INITIAL STATES
				style({
					height: 0,
					opacity: 0,
					transform: 'scale(0.85)',
					'margin-bottom': 0,
					//
					// EXPAND OUT ALL PROPERTIES
					paddingTop: 0,
					paddingBottom: 0,
					paddingRight: 0,
					paddingLeft: 0
				}),
				//
				// FIRST ANIMATE SPACING, WHICH INCLUDES HEIGHT AND MARGIN
				// params = timing, styles({  }) then animate final state 'animate(ms)'
				// '*' means height of element
				animate(
					'50ms',
					style({
						height: '*',
						marginBottom: '*',
						paddingTop: '*',
						paddingBottom: '*',
						paddingLeft: '*',
						paddingRight: '*'
					})
				),
				animate(100)
			]),
			transition('* => void', [
				//
				// scale up before scaling down as deleted
				animate(
					50,
					style({
						transform: 'scale (1.05)'
					})
				),
				//
				// then scale down while fading out
				animate(50, style({ transform: 'scale (0.7)', opacity: 0.75 })),
				//
				// scale down fade out completely
				// string needed as timing function 'ease-out used'
				animate('120ms ease-out', style({ transform: 'scale(0.52)', opacity: 0 })),
				//
				// then animate spacing which includes height, padding and margin
				animate(
					'150ms ease-out',
					style({
						height: 0,
						paddingTop: 0,
						paddingBottom: 0,
						paddingLeft: 0,
						paddingRight: 0,
						'margin-bottom': '0'
					})
				)
			])
		]),
		trigger('listAnimation', [
			transition('* => *', [
				query(
					':enter',
					[
						style({
							opacity: 0,
							height: 0
						}),
						stagger(100, [animate('0.2s ease')])
					],
					{
						optional: true
					}
				)
			])
		])
	]
})
export class NotesListComponent implements OnInit {
	cardTitle = '';
	body = '';

	notes: Note[] = new Array<Note>();

	searchText!: string;

	filteredList: Note[] = this.notes;

	constructor(private notesService: NotesService) {}

	ngOnInit(): void {
		this.notesService.refreshNotes();
		// console.log(this.notesService.orderedArray)
		this.notesService.notes$.subscribe(notes => {
			this.notes = notes;
			this.filteredList = notes;
			console.log('OnInit, notes: ', this.notes);
			if (this.notes.length === 0) {
				console.log('no notes stored in the localStorage');
			}
		});
	}

	deleteNote(id: string) {
		this.notesService.delete(id);
	}

	clearAll(): void {
		this.notesService.clearAll();
	}

	// search functions

	onInputChange() {
		this.filteredList = this.notes
			.map(note => ({
				note,
				relevance: this.calculateRelevance(note, this.searchText.toLowerCase())
			}))
			.filter(item => item.relevance > 0)
			.sort((a, b) => b.relevance - a.relevance)
			.map(item => item.note);
	}

	// Search relevance score function
	calculateRelevance(note: Note, searchTerm: string): number {
		const titleMatches = note.title.toLowerCase().split(searchTerm).length - 1;
		const bodyMatches = note.body.toLowerCase().split(searchTerm).length - 1;
		return titleMatches + bodyMatches;
	}

	onSortChange(event: any) {
		const selectedSort = event.target.value;

		if (selectedSort === 'date') {
			this.filteredList.sort((a, b) => b.date - a.date);
		} else if (selectedSort === 'alphabetical') {
			this.filteredList.sort((a, b) => a.title.localeCompare(b.title));
		}
	}
}
