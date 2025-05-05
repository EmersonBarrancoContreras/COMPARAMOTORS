import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { News } from '@shared/interfaces/new';

@Component({
  selector: 'app-cards',
  imports: [CommonModule, CardModule, ButtonModule, TagModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
})
export class CardsComponent {
  @Input() items: any[] = []; // Array de elementos a mostrar
  @Input() columns: number = 3; // Número de columnas para el diseño de la cuadrícula
  @Input() showImage: boolean = true; // Mostrar u ocultar la imagen
  @Input() showDescription: boolean = true; // Mostrar u ocultar la descripción
  @Input() maxDescriptionLength: number = 150; // Longitud máxima de la descripción   

  @Output() cardClick = new EventEmitter<News>();

  // Método para truncar la descripción si excede la longitud máxima
  truncateDescription(text: string): string {
    if (!text) return '';
    return text.length > this.maxDescriptionLength
      ? text.substring(0, this.maxDescriptionLength) + '...'
      : text;
  }

  // Método para manejar el clic en una tarjeta
  onCardClick(item: any): void {
    this.cardClick.emit(item);
  }

  // Método para obtener el estilo de la cuadrícula
  getGridStyle(): { [key: string]: string } {
    return {
      display: 'grid',
      'grid-template-columns': `repeat(${this.columns}, 1fr)`,
      gap: '1rem',
    };
  }
}
