import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  constructor(private authService: AuthService) {
  }

  login(): void {
    this.authService.loginWithGoogle().then(user => {
    }).catch(error => {
    });
  }
}
