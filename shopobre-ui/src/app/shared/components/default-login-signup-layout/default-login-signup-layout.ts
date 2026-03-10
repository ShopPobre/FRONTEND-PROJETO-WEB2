import { Component, input } from '@angular/core';
import { Header } from '../header/header';

@Component({
  selector: 'app-default-login-signup-layout',
  imports: [Header],
  templateUrl: './default-login-signup-layout.html',
  styleUrl: './default-login-signup-layout.scss',
})
export class DefaultLoginSignupLayout {
  textspan =  input.required<string>();
  text = input.required<string>();
  label = input.required<string>();
  welcomeText = input.required<string>();
  buttonText = input.required<string>();
}
