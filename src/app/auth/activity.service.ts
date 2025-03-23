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
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

export interface Activity {
  id: string;
  name: string;
  createdAt: number;
  isActive?: boolean;
  startTime?: number | null;
  duration?: number; // duration in milliseconds
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
      isActive: false,
      startTime: null,
      duration: 0,
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

  async startActivity(activityId: string): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not logged in');
    const activityDoc = doc(
      this.firestore,
      `users/${user.uid}/activities/${activityId}`
    );
    await updateDoc(activityDoc, {
      isActive: true,
      startTime: Date.now(),
    });
  }

  async stopActivity(activity: Activity): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not logged in');
    const now = Date.now();
    // Calculate elapsed time since this activity was started
    const elapsed = activity.startTime ? now - activity.startTime : 0;
    // Sum up with any previously recorded duration
    const newDuration = (activity.duration || 0) + elapsed;
    const activityDoc = doc(
      this.firestore,
      `users/${user.uid}/activities/${activity.id}`
    );
    await updateDoc(activityDoc, {
      isActive: false,
      duration: newDuration,
      startTime: null,
    });
  }
}
