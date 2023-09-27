import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class CouponsService {
	constructor(private http: HttpClient) {}

	validate(code: string) {
		return this.http.get(
			`${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/coupons`,
			{
				params: {
					code,
				},
			}
		);
	}
}
