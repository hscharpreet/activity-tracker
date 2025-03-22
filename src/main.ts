import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    // Initialize Firebase using the config from your environment file
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // Set up Firestore and Authentication
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ]
}).catch(err => console.error(err));
