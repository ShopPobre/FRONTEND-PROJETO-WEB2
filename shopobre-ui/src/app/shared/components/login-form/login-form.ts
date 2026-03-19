import { Component, model, signal } from '@angular/core';
import { FormInput } from '../form-input/form-input';
import { LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login-form',
  imports: [FormInput],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {

  authData = model.required<LoginRequest>();
  
  updateField(field: keyof LoginRequest, value: string) {
    this.authData.update((prev) => ({ ...prev, [field]: value }));
  }
}
