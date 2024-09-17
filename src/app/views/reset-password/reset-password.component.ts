import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { log } from 'async';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { ValidatorsService } from 'src/app/services/validators.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  public password: string = '';
  public confirm: string = '';
  public errors = {
    password: '',
    confirm: '',
  };
  public token: string = undefined;

  constructor(
    private messageService: MessageService,
    private usersService: UsersService,
    private validator: ValidatorsService,
    private activateRouter: ActivatedRoute,
    private router: Router
  ) {
    this.activateRouter.queryParams.subscribe((params) => {
      this.token = params.token;
      this.checkToken();
    });
  }

  checkToken() {
    if (!!!this.token) {
      this.router.navigate(['/']);
    }
  }

  validate() {
    let isValid = true;
    const validatorPassword = this.validator.validatePassword(this.password);
    if (!!!validatorPassword.isValid) {
      this.errors.password = validatorPassword.message;
      isValid = false;
    }

    // Validación de la confirmación de la contraseña
    if (this.password !== this.confirm) {
      this.errors.confirm = 'Las contraseñas no coinciden.';
      isValid = false;
    }
    if (isValid) {
      this.resetPassword();
    }
  }

  public resetPassword() {
    this.usersService.resetPassword(this.token, this.password).subscribe(
      () => {
        this.password = '';
        this.confirm = '';
        this.messageService.add({
          severity: 'success',
          summary: 'Contraseña modificada',
          detail:
            'La nueva contraseña ha sido establecida con éxito y ya puedes iniciar sesión con ella',
        });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error modificando la contraseña',
        });
      }
    );
  }
}
