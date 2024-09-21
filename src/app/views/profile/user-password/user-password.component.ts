import { Component, OnInit } from '@angular/core';
import { ValidatorsService } from 'src/app/services/validators.service';
import { MessageService } from 'primeng/api';
import { selectCustomer } from 'src/app/_selectors/customer.selectors';
import { UsersService } from 'src/app/services/users.service';
import { Store } from '@ngrx/store';
import Customer from 'src/app/interfaces/Customer';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.scss'],
})
export class UserPasswordComponent implements OnInit {
  public password: string = '';
  public confirm: string = '';
  public errors;
  public customer: Customer;

  public textButton = 'Actualizar';
  public updating = false;

  constructor(
    public validator: ValidatorsService,
    public usersService: UsersService,
    public messageService: MessageService,
    public store: Store
  ) {}

  clear() {
    this.password = '';
    this.confirm = '';
    this.clearErrors();
  }

  clearErrors() {
    this.errors = {
      password: '',
      confirm: '',
    };
  }

  validate() {
    this.clearErrors();
    let isValid = true;
    const validatorPassword = this.validator.validatePassword(this.password);
    if (!!!validatorPassword.isValid) {
      this.errors.password = validatorPassword.message;
      isValid = false;
    }

    if (this.password !== this.confirm) {
      this.errors.confirm = 'Las contraseñas no coinciden.';
      isValid = false;
    }
    if (isValid) {
      this.modify();
    }
  }

  updateStatus() {
    this.textButton = 'Actualizando...';
    this.updating = true;
  }

  modify() {
    this.updateStatus();

    this.usersService
      .modifyPassword(this.customer.id, this.password)
      .subscribe({
        next: () => {
          this.textButton = 'Actualizar';
          this.updating = false;
          this.clear();
          this.messageService.add({
            severity: 'success',
            detail: 'La contraseña se ha modificado con éxito',
            summary: 'Contraseña modificada',
          });
        },
        error: (err) => {
          this.textButton = 'Actualizar';
          this.updating = false;
          this.messageService.add({
            severity: 'error',
            detail: 'Ha ocurrido y la contraseña no se ha modificado',
            summary: 'Error',
          });
        },
      });
  }

  ngOnInit(): void {
    this.clearErrors();
    this.store.select(selectCustomer).subscribe((customer: Customer) => {
      this.customer = customer;
    });
  }
}
