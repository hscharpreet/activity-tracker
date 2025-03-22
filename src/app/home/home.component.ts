import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Home</h2>
    <div *ngIf="user; else loading">
      <p>Welcome, {{ user.displayName || user.email }}!</p>
      <br /><br />
      <button (click)="logout()">Logout</button>
    </div>
    <ng-template #loading>
      <p>Loading user info...</p>
    </ng-template>
  `,
})
export class HomeComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout().then(() => {
      console.log('User logged out');
      // Redirect to login page after logout
      this.router.navigate(['/login']);
    });
  }
}
