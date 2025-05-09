import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seccion-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seccion-1.component.html',
  styleUrl: './seccion-1.component.scss',
})
export class Seccion1Component implements OnInit {
  expandedIndex: number | null = null;

  constructor() {}

  ngOnInit(): void {}

  onClick() {
    const element = document.getElementById('img');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleItem(index: number, event: MouseEvent) {
    event.stopPropagation(); // Evitar que el clic se propague a la tarjeta
    if (this.expandedIndex === index) {
      this.expandedIndex = null; // Contraer si ya está expandido
    } else {
      this.expandedIndex = index; // Expandir el ítem seleccionado
    }
  }
}
