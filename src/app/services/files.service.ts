import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class FilesService {
	constructor(private http: HttpClient) {}

	upload(file) {
		const formData = new FormData();
		formData.append('file', file);
		return this.http.post(
			`${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/files/upload`,
			formData
		);
	}
}
