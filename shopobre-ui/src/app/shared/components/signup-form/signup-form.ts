import { Component } from '@angular/core';
import { FormInput } from '../form-input/form-input';

@Component({
  selector: 'app-signup-form',
  imports: [FormInput],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.scss',
})
export class SignupForm {
}
