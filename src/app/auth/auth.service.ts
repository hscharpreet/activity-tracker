import { Injectable } from '@angular/core';
import { Auth, user, User, signOut } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Emits the currently signed-in user (or null)
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    // The `user()` function returns an observable tracking auth state
    this.user$ = user(this.auth);
  }

  // Synchronously get the current user (may be null if not signed in)
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Log out the current user
  logout(): Promise<void> {
    return signOut(this.auth);
  }
}
