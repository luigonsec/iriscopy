import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
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
export class LoginComponent implements OnInit {
  public username;
  public password;
  public error: any;

  constructor(private router: Router, private store: Store<AppState>) {
    this.store.select(selectCustomer).subscribe((customer) => {
      if (customer) {
        this.router.navigate(['/']);
      }
    });

    this.store.select(selectLoginFailure).subscribe((error) => {
      this.error = '';
      if (error) {
        this.error = 'Usuario o contraseña incorrecta';
      }
    });
  }

  performLogin() {
    const options = {
      username: this.username,
      password: this.password,
    };
    this.store.dispatch(
      login({
        username: options.username,
        password: options.password,
      })
    );
  }

  ngOnInit(): void {}
}
