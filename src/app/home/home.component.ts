import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { ActivityService, Activity } from '../auth/activity.service';
import { Subscription, interval } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  user: User | null = null;
  allActivities: Activity[] = [];
  activeActivity: Activity | null = null;
  nonActiveActivities: Activity[] = [];
  currentTime: number = Date.now();
  private subs = new Subscription();
  private intervalSub: any;

  constructor(
    private authService: AuthService,
    private activityService: ActivityService
  ) {}

  ngOnInit() {
    this.subs.add(
      this.authService.user$.subscribe((user) => {
        this.user = user;
      })
    );

    this.subs.add(
      this.activityService.getActivities().subscribe((activities) => {
        this.allActivities = activities;
        this.activeActivity = activities.find((a) => a.isActive) || null;
        this.nonActiveActivities = activities.filter((a) => !a.isActive);
      })
    );

    this.intervalSub = interval(1000).subscribe(() => {
      this.currentTime = Date.now();
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    if (this.intervalSub) this.intervalSub.unsubscribe();
  }

  logout() {
    this.authService
      .logout()
      .then(() => {
        console.log('User logged out');
      })
      .catch((err) => console.error(err));
  }

  startActivity(activity: Activity) {
    this.activityService
      .startActivity(activity.id)
      .catch((err) => console.error(err));
  }

  stopActiveActivity() {
    if (this.activeActivity) {
      this.activityService
        .stopActivity(this.activeActivity)
        .catch((err) => console.error(err));
    }
  }

  getCurrentDuration(activity: Activity): number {
    if (activity.isActive && activity.startTime) {
      return this.currentTime - activity.startTime;
    }
    return 0;
  }

  formatDuration(duration: number): string {
    const sec = Math.floor(duration / 1000) % 60;
    const min = Math.floor(duration / (1000 * 60)) % 60;
    const hr = Math.floor(duration / (1000 * 60 * 60));
    return `${hr.toString().padStart(2, '0')}:${min
      .toString()
      .padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
}
