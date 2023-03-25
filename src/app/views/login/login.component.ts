import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public username;
  public password;

  constructor(private authLogin: AuthService) {}

  performLogin() {
    const options = {
      username: this.username,
      password: this.password,
    };
    this.authLogin.login(options).subscribe((response) => {
      console.log(response);
    });
  }

  ngOnInit(): void {}
}
