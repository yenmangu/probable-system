import { v4 as uuidv4 } from 'uuid';

export class Note {
	public title: string;
	public body: string;
	public date: number;
	public id: string;

	constructor(title: string, body: string) {
		this.id = uuidv4();
		this.date = this.generateDateString(this.id);
		this.title = title;
		this.body = body;
	}

	generateDateString(id: string) {
		const time = new Date().getTime();
		console.log(`note Id:${id} timestamp in UTC is: ${time}`);
		return time;
	}
}
