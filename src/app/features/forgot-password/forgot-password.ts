import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPasswordComponent {
  public auth = inject(AuthService);
  private router = inject(Router);

  step = signal<'request' | 'reset' | 'success'>('request');

  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';

  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  infoMessage = signal('');

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  isEmailValid(): boolean {
    return this.auth.validateEmail(this.email);
  }

  passwordPolicy() {
    return this.auth.validatePasswordPolicy(this.newPassword);
  }

  passwordsMatch(): boolean {
    return this.newPassword.length > 0 && this.newPassword === this.confirmPassword;
  }

  async onRequestToken(): Promise<void> {
    if (!this.email || !this.isEmailValid()) {
      this.errorMessage.set('Please provide a valid registered email address.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.infoMessage.set('');

    const res = await this.auth.forgotPassword(this.email.trim());
    this.isLoading.set(false);

    if (res.success) {
      if (res.resetToken) {
        this.token = res.resetToken;
      }
      this.infoMessage.set(res.message || 'Reset token generated successfully.');
      this.step.set('reset');
    } else {
      this.errorMessage.set(res.message || 'Failed to request reset token. Please verify the email.');
    }
  }

  async onResetPassword(): Promise<void> {
    if (!this.token.trim()) {
      this.errorMessage.set('Please provide the reset token.');
      return;
    }

    if (!this.passwordPolicy().valid) {
      this.errorMessage.set('New password must satisfy the password policy.');
      return;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const res = await this.auth.resetPassword({
      email: this.email.trim(),
      token: this.token.trim(),
      newPassword: this.newPassword
    });

    this.isLoading.set(false);

    if (res.success) {
      this.step.set('success');
    } else {
      this.errorMessage.set(res.message || 'Failed to reset password. Please verify the token.');
    }
  }
}
