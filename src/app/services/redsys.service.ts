import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Order from '../interfaces/Order';

@Injectable({
	providedIn: 'root',
})
export class RedsysService {
	constructor(public http: HttpClient) {}

	sendPayment(order: Order, bizum: boolean) {
		return this.http.post(
			`${environment.api.protocol}://${environment.api.host}:${environment.api.port}/api/v1/redsys/${order.id}`,
			{ order, bizum }
		);
	}
}
