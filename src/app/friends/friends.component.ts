import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Firestore,
  docData,
  doc,
  collection,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../auth/user.service';
import { Subscription, interval } from 'rxjs';
import { User } from '@angular/fire/auth';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  currentActivity?: {
    name: string;
    startTime: number;
  } | null;
  friends?: string[];
}

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './friends.component.html',
})
export class FriendsComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  currentUserProfile: UserProfile | null = null;
  friendsProfiles: UserProfile[] = [];
  currentTime: number = Date.now();
  newFriendUid: string = '';
  private subs = new Subscription();
  private intervalSub: any;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Subscribe to the current authenticated user.
    this.subs.add(
      this.authService.user$.subscribe((user) => {
        this.currentUser = user;
        if (user) {
          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          // Subscribe to the current user's profile document.
          this.subs.add(
            docData(userDocRef).subscribe((profile) => {
              this.currentUserProfile = profile as UserProfile;
              if (this.currentUserProfile) {
                // Start with the friends array (if exists), or an empty array.
                let friendUIDs = this.currentUserProfile.friends
                  ? [...this.currentUserProfile.friends]
                  : [];
                // Ensure the current user's UID is included.
                if (
                  this.currentUser &&
                  !friendUIDs.includes(this.currentUser.uid)
                ) {
                  friendUIDs.push(this.currentUser.uid);
                }
                if (friendUIDs.length > 0) {
                  const usersCollection = collection(this.firestore, 'users');
                  // Firestore 'in' queries accept at most 10 elements.
                  const q = query(
                    usersCollection,
                    where('__name__', 'in', friendUIDs)
                  );
                  getDocs(q)
                    .then((snapshot) => {
                      this.friendsProfiles = snapshot.docs.map((doc) => ({
                        uid: doc.id,
                        ...doc.data(),
                      })) as UserProfile[];
                    })
                    .catch((err) => console.error(err));
                } else {
                  this.friendsProfiles = [];
                }
              }
            })
          );
        }
      })
    );

    // Update current time every second to compute live durations.
    this.intervalSub = interval(1000).subscribe(() => {
      this.currentTime = Date.now();
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.intervalSub) this.intervalSub.unsubscribe();
  }

  // Compute the current session duration for a friend's activity.
  getFriendCurrentDuration(profile: UserProfile): number {
    if (profile.currentActivity && profile.currentActivity.startTime) {
      return this.currentTime - profile.currentActivity.startTime;
    }
    return 0;
  }

  // Format a duration (milliseconds) into hh:mm:ss.
  formatDuration(duration: number): string {
    const sec = Math.floor(duration / 1000) % 60;
    const min = Math.floor(duration / (1000 * 60)) % 60;
    const hr = Math.floor(duration / (1000 * 60 * 60));
    return `${hr.toString().padStart(2, '0')}:${min
      .toString()
      .padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  // Add a friend using the newFriendUid value.
  addFriend() {
    if (this.newFriendUid.trim()) {
      this.userService
        .addFriend(this.newFriendUid.trim())
        .then(() => {
          console.log('Friend added');
          this.newFriendUid = '';
          // Optionally, refresh friend list here if needed.
        })
        .catch((err) => console.error('Error adding friend:', err));
    }
  }
}
