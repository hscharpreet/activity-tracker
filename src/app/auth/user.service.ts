import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, arrayUnion } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  updateCurrentActivity(
    activity: { name: string; startTime: number } | null
  ): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) return Promise.reject('User not logged in');
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    return setDoc(userDoc, { currentActivity: activity }, { merge: true });
  }

  addFriend(friendId: string): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) return Promise.reject('User not logged in');
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    return setDoc(userDoc, { friends: arrayUnion(friendId) }, { merge: true });
  }
}
