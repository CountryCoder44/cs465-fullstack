import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Authentication } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authentication = inject(Authentication);

  submitted = signal(false);
  formError = signal('');

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  public onLoginSubmit(): void {
    this.submitted.set(true);
    this.formError.set('');
    if (this.loginForm.invalid) {
      this.formError.set('All fields are required, please try again');
      return;
    }
    this.doLogin();
  }

  private doLogin(): void {
    const { email, password } = this.loginForm.getRawValue();
    const user = { name: '', email } as User;

    this.authentication.login(user, password).subscribe({
      next: () => {
        // Token is saved by the service - head back to the trip list
        this.router.navigate(['']);
      },
      error: (error: any) => {
        this.formError.set(error.status === 401
          ? 'Incorrect email or password'
          : 'Unable to log in: ' + error.message);
        console.log('Error: ' + error.message);
      }
    });
  }

  // Shortcut for the template to read form controls
  get f() {
    return this.loginForm.controls;
  }
}
