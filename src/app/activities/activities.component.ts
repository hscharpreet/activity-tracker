import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityService, Activity } from '../auth/activity.service';
import { ConfirmModalComponent } from '../shared/confirm-modal.component';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './activities.component.html',
})
export class ActivitiesComponent implements OnInit {
  newActivityName: string = '';
  activities: Activity[] = [];
  editingActivity: string | null = null;
  editActivityName: string = '';

  // Track the activity selected for deletion
  activityToDelete: Activity | null = null;

  // Access the confirm modal instance via ViewChild
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;

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

  openDeleteModal(activity: Activity) {
    this.activityToDelete = activity;
    this.confirmModal.open();
  }

  onDeleteConfirmed(confirmed: boolean) {
    if (confirmed && this.activityToDelete) {
      this.activityService
        .deleteActivity(this.activityToDelete.id)
        .catch((err) => console.error('Error deleting activity:', err));
    }
    // Reset the activityToDelete after confirmation
    this.activityToDelete = null;
  }
}
