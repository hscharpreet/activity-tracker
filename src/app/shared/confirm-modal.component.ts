import {
  Component,
  EventEmitter,
  Output,
  Input,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent implements AfterViewInit {
  @Input() title: string = 'Confirm';
  @Input() message: string = 'Are you sure?';
  @Output() confirmed = new EventEmitter<boolean>();

  private modalInstance: Modal | null = null;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Create the modal instance after view initialization
    const modalElement = this.el.nativeElement.querySelector('.modal');
    this.modalInstance = new Modal(modalElement);
  }

  open(): void {
    this.modalInstance?.show();
  }

  close(): void {
    this.modalInstance?.hide();
  }

  onConfirm(): void {
    this.confirmed.emit(true);
    this.close();
  }

  onCancel(): void {
    this.confirmed.emit(false);
    this.close();
  }
}
