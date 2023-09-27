import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { login } from 'src/app/_actions/customer.actions';
import {
	selectCustomer,
	selectLoginFailure,
} from 'src/app/_selectors/customer.selectors';
import { AppState } from 'src/app/app.state';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
	public username;
	public password;
	public error: any;
	public subscriptor: Subscription;

	constructor(
    private router: Router,
    private store: Store<AppState>,
    private activatedRouter: ActivatedRoute
	) {
		this.activatedRouter.queryParams.subscribe((data) => {
			const backTo = data.backTo;
			this.subscriptor = this.store
				.select(selectCustomer)
				.subscribe((customer) => {
					if (customer) {
						if (backTo) return this.router.navigate([backTo]);
						this.router.navigate(['/']);
					}
				});
		});

		this.store.select(selectLoginFailure).subscribe((error) => {
			this.error = '';
			if (error) {
				this.error = 'Usuario o contraseña incorrecta';
			}
		});
	}

	ngOnDestroy(): void {
		this.subscriptor.unsubscribe();
	}

	performLogin() {
		let username = this.username;

		const atIndex = username.indexOf('@');
		if (atIndex >= 0) {
			username = username.slice(0, atIndex);
		}

		const options = {
			username,
			password: this.password,
		};
		this.store.dispatch(login(options));
	}

	ngOnInit(): void {}
}
