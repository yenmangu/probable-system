import {
	AfterViewChecked,
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	Renderer2,
	ViewChild
} from '@angular/core';
import { NotesService } from '../shared/notes.service';

@Component({
	selector: 'app-note-card',
	templateUrl: './note-card.component.html',
	styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements AfterViewInit {
	// input for  dynamic element

	@Input() title!: string;
	@Input() body!: string;
	@Input() link!: string;

	@Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();

	@ViewChild('truncator', { static: true }) truncator!: ElementRef<HTMLElement>;
	@ViewChild('bodyText', { static: true }) bodyText!: ElementRef<HTMLElement>;
	@ViewChild('noteP', { static: true }) noteP!: ElementRef<HTMLElement>;

	constructor(private renderer: Renderer2, private notesService: NotesService) {}

	ngAfterViewInit(): void {
		this.updateTruncation();
	}

	// Work out if there is a text overflow and if not, then hide the truncator

	private updateTruncation(): void {
		if (
			this.noteP.nativeElement.scrollHeight >
			this.bodyText.nativeElement.clientHeight
		) {
			// console.log('text overflow detected');
			// if there is a text overflow, show fadeout truncator
			this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
		} else {
			// console.log('no text overflow');
			// hide fadeout truncator
			this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
		}
	}

	delete() {
		this.deleteEvent.emit();
	}
}
