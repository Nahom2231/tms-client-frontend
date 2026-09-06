import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  public auth = inject(AuthService);
  private router = inject(Router);

  form = {
    firstName: '',
    email: '',
    role: 'Student' as 'Student' | 'Instructor',
    password: '',
    confirmPassword: ''
  };

  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  touched = {
    email: signal(false),
    password: signal(false),
    confirmPassword: signal(false)
  };

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  isEmailValid(): boolean {
    return this.auth.validateEmail(this.form.email);
  }

  passwordPolicy() {
    return this.auth.validatePasswordPolicy(this.form.password);
  }

  passwordsMatch(): boolean {
    return this.form.password.length > 0 && this.form.password === this.form.confirmPassword;
  }

  isFormValid(): boolean {
    return (
      !!this.form.firstName.trim() &&
      this.isEmailValid() &&
      this.passwordPolicy().valid &&
      this.passwordsMatch()
    );
  }

  async onSubmit(): Promise<void> {
    this.touched.email.set(true);
    this.touched.password.set(true);
    this.touched.confirmPassword.set(true);

    if (!this.form.firstName.trim()) {
      this.errorMessage.set('Please provide your name.');
      return;
    }

    if (!this.isEmailValid()) {
      this.errorMessage.set('Please provide a valid email format.');
      return;
    }

    if (!this.passwordPolicy().valid) {
      this.errorMessage.set('Password does not meet the security policy requirements.');
      return;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const payload: RegisterRequest = {
      email: this.form.email.trim(),
      password: this.form.password,
      firstName: this.form.firstName.trim(),
      role: this.form.role
    };

    const res = await this.auth.register(payload);
    this.isLoading.set(false);

    if (res.success) {
      this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
    } else {
      this.errorMessage.set(res.message || 'Registration failed. Please try again.');
    }
  }
}
