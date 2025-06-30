import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../data-access/auth.service';

interface LogInForm{
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-auth-log-in',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: `./auth-log-in.component.html`,
  styleUrl: './auth-log-in.component.scss'
})


export default class AuthLogInComponent {

  private _formBuilder = inject(FormBuilder);

  private _authService = inject(AuthService);

  private _router = inject(Router)
  //FormBuilder Instance wasaa
  form = this._formBuilder.group<LogInForm>({
    email: this._formBuilder.control(null, [
      Validators.required,
      Validators.email
    ]),

    password: this._formBuilder.control(null, [Validators.required]),
  });

  //Submission method

  async submit() {
    if (this.form.invalid) return;

    try {
      const { error} = await this._authService.logIn({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? ''
      });

      if (error) throw error;

      this._router.navigateByUrl('/cooker');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }
}
