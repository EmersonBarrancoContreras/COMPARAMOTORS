import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

  // Función para manejar la suscripción al boletín (se puede implementar en el futuro)
  onSubscribe(email: string): void {
    // Aquí iría la lógica para procesar la suscripción al boletín
    console.log('Suscripción solicitada con el email:', email);
  }
}
