import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Login</h2>
    <button (click)="loginWithGoogle()">Login with Google</button>
  `,
})
export class LoginComponent implements OnInit {
  constructor(private auth: Auth) {}

  ngOnInit(): void {}

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      console.log('User logged in with Google:', userCredential);
    } catch (error) {
      console.error('Google login error:', error);
    }
  }
}
