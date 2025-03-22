import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { TestComponent } from './test.component';
import { authGuard } from './auth.guards';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'test',
    component: TestComponent,
    canActivate: [authGuard], // Protected route
  },
  { path: '', redirectTo: 'test', pathMatch: 'full' },
];
