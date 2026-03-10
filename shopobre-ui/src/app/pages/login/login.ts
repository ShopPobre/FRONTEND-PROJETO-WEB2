import { Component } from '@angular/core';
import { DefaultLoginSignupLayout } from '../../shared/components/default-login-signup-layout/default-login-signup-layout';
import { SignupForm } from '../../shared/components/signup-form/signup-form';
import { LoginForm } from '../../shared/components/login-form/login-form';

@Component({
  selector: 'app-login',
  imports: [DefaultLoginSignupLayout, LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

}
