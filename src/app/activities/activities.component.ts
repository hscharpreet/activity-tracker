import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityService, Activity } from '../auth/activity.service';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activities.component.html',
})
export class ActivitiesComponent implements OnInit {
  newActivityName: string = '';
  activities: Activity[] = [];
  editingActivity: string | null = null;
  editActivityName: string = '';

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.activityService.getActivities().subscribe((activities) => {
      this.activities = activities;
    });
  }

  addActivity() {
    if (this.newActivityName.trim()) {
      this.activityService
        .addActivity(this.newActivityName.trim())
        .then(() => {
          this.newActivityName = '';
        })
        .catch((err) => console.error('Error adding activity:', err));
    }
  }

  startEditing(activity: Activity) {
    this.editingActivity = activity.id;
    this.editActivityName = activity.name;
  }

  saveEdit(activity: Activity) {
    if (this.editActivityName.trim()) {
      this.activityService
        .updateActivity(activity.id, this.editActivityName.trim())
        .then(() => {
          this.editingActivity = null;
          this.editActivityName = '';
        })
        .catch((err) => console.error('Error updating activity:', err));
    }
  }

  cancelEdit() {
    this.editingActivity = null;
    this.editActivityName = '';
  }
}
