import { Toast } from 'primeng/toast';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, Toast],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [MessageService],
})
export class HeaderComponent {
  title = 'primeng';
  constructor(private MessageService: MessageService) {}

  show() {
    this.MessageService.add({
      severity: 'success',
      summary: 'Info Message',
      detail: 'PrimeNG Toast',
    });
  }
}
