import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(private auth: Auth, private router: Router) {}

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      console.log('User logged in with Google:', userCredential);
      // Redirect to Home after successful login
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Google login error:', error);
    }
  }
}
