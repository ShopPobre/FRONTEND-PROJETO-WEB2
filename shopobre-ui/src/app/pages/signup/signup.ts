import { Component } from '@angular/core';
import { DefaultLoginSignupLayout } from '../../shared/components/default-login-signup-layout/default-login-signup-layout';
import { SignupForm } from '../../shared/components/signup-form/signup-form';

@Component({
  selector: 'app-signup',
  imports: [DefaultLoginSignupLayout, SignupForm],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {

}
