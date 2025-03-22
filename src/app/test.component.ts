import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-test',
  standalone: true,
  template: `
    <p>Check the console for Firestore test output.</p>
  `,
})
export class TestComponent implements OnInit {
  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    // Reference a test collection named 'test'
    const testCollection = collection(this.firestore, 'test');
    collectionData(testCollection).subscribe((data) => {
      console.log('Firestore data:', data);
    });
  }
}
