import { Component, model } from '@angular/core';
import { FormInput } from '../form-input/form-input';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-signup-form',
  imports: [FormInput],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.scss',
})
export class SignupForm {
  userData = model.required<User>();

  updateField(field: keyof User, value: string) {
    this.userData.update((prev) => ({ ...prev, [field]: value }));
  }
}
