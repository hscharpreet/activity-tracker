import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

export interface Activity {
  id: string;
  name: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async addActivity(name: string): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not logged in');

    const ref = doc(collection(this.firestore, `users/${user.uid}/activities`));
    const newActivity: Activity = {
      id: ref.id,
      name,
      createdAt: Date.now(),
    };
    await setDoc(ref, newActivity);
  }

  async updateActivity(activityId: string, name: string): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not logged in');

    const activityDoc = doc(
      this.firestore,
      `users/${user.uid}/activities/${activityId}`
    );
    await updateDoc(activityDoc, { name });
  }

  async deleteActivity(activityId: string): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not logged in');

    const activityDoc = doc(
      this.firestore,
      `users/${user.uid}/activities/${activityId}`
    );
    await deleteDoc(activityDoc);
  }

  getActivities(): Observable<Activity[]> {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not logged in');

    const colRef = collection(this.firestore, `users/${user.uid}/activities`);
    return collectionData(colRef, { idField: 'id' }) as Observable<Activity[]>;
  }
}
