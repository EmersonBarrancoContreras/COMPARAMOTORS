import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { PublicityComponent } from '../../../features/landing/components/publicity/publicity.component';

@Component({
  selector: 'app-modal',
  imports: [Dialog, ButtonModule, PublicityComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
}
