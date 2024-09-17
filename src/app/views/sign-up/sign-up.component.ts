import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { login } from 'src/app/_actions/customer.actions';
import { selectCustomer } from 'src/app/_selectors/customer.selectors';
import { AppState } from 'src/app/app.state';
import { AuthService } from 'src/app/services/auth.service';
import { CustomersService } from 'src/app/services/customers.service';
import { ValidatorsService } from 'src/app/services/validators.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  public email: string;
  public username: string;
  public password: string;
  public passwordConfirm: string;
  public errors = {
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    general: '',
  };
  subscriptor: Subscription;
  buttonText: string = 'Acceder';

  constructor(
    public customerService: CustomersService,
    public authService: AuthService,
    public router: Router,
    public validator: ValidatorsService,
    private store: Store<AppState>
  ) {}

  clear() {
    this.resetButton();
    this.email = '';
    this.password = '';
    this.username = '';
    this.passwordConfirm = '';
    this.errors = {
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
      general: '',
    };
  }

  validate(): boolean {
    this.errors = {
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
      general: '',
    };

    let isValid = true;

    if (!this.username || this.username.trim().length === 0) {
      this.errors.username = 'El nombre de usuario es obligatorio.';
      isValid = false;
    }

    // Validación del email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !emailPattern.test(this.email)) {
      this.errors.email = 'El correo electrónico no es válido.';
      isValid = false;
    }

    const validatorPassword = this.validator.validatePassword(this.password);
    if (!!!validatorPassword.isValid) {
      this.errors.password = validatorPassword.message;
      isValid = false;
    }

    // Validación de la confirmación de la contraseña
    if (this.password !== this.passwordConfirm) {
      this.errors.passwordConfirm = 'Las contraseñas no coinciden.';
      isValid = false;
    }

    return isValid;
  }

  register() {
    this.buttonText = 'Registrando...';
    if (this.validate()) {
      const customer = {
        email: this.email,
        username: this.username,
        password: this.password,
      };

      this.customerService.register(customer).subscribe(
        () => {
          this.store.dispatch(
            login({
              username: this.username,
              password: this.password,
            })
          );
          this.clear();
        },
        (error: HttpErrorResponse) => {
          this.resetButton();
          this.errors['general'] = error.error.message;
        }
      );
    } else {
      this.resetButton();
    }
  }
  resetButton() {
    this.buttonText = 'Acceder';
  }

  ngOnDestroy(): void {
    if (this.subscriptor) {
      this.subscriptor.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.subscriptor = this.store
      .select(selectCustomer)
      .subscribe((customer) => {
        if (customer) {
          this.router.navigate(['/profile'], {
            queryParams: { signup: true },
          });
        }
      });
  }
}
