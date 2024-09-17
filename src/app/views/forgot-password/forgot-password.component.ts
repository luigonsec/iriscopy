import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  public email: string = '';

  constructor(
    private usersService: UsersService,
    private messageService: MessageService
  ) {}

  reset() {
    if (this.email && this.email.trim() != '') {
      this.usersService.forgotPassword(this.email.trim()).subscribe(() => {
        this.email = '';
        this.messageService.add({
          summary: 'Petición recibida',
          detail:
            'Se ha enviado un correo electrónico con los pasos para reestablecer la contraseña',
          severity: 'success',
        });
      });
    }
  }
}
