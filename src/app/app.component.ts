import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Activity Tracker</h1>
    <p>Check the console for Firestore test output.</p>
  `,
})
export class AppComponent implements OnInit {
  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    // Reference a test collection named 'test'
    const testCollection = collection(this.firestore, 'test');
    collectionData(testCollection).subscribe(data => {
      console.log('Firestore data:', data);
    });
  }
}
