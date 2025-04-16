import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ShowcaseItem {
  title: string;
  category: string;
  description: string;
  image: string;
  details: { label: string; value: string }[];
}

@Component({
  selector: 'app-publicity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publicity.component.html',
  styleUrl: './publicity.component.scss',
})
export class PublicityComponent implements OnInit {
  @ViewChild('showcaseMain') showcaseMain!: ElementRef;

  // Índice del elemento actualmente seleccionado
  currentIndex: number = 0;

  // Imágenes para miniaturas
  images: string[] = [
    'assets/img/foto.png',
    'assets/img/foto2.jpg',
    'assets/img/foto.png',
    'assets/img/foto.png',
    'assets/img/foto.png',
    'assets/img/foto.png',
  ];

  // Datos completos para cada elemento
  showcaseItems: ShowcaseItem[] = [
    {
      title: 'Nuevo Warframe: Caliban',
      category: 'WARFRAMES',
      description:
        'Forjado en las ruinas sentientes, Caliban es un híbrido de humano y sentient que desata devastador poder alienígena.',
      image: 'assets/img/foto.png',
      details: [
        { label: 'Tipo', value: 'Hibrido Sentient' },
        { label: 'Habilidades', value: '4 únicas' },
        { label: 'Disponibilidad', value: 'Quest: New War' },
      ],
    },
    {
      title: 'Arma Primaria: Nataruk',
      category: 'ARMAS',
      description:
        'Un arco sentient que dispara flechas de energía pura, capaces de atravesar múltiples enemigos.',
      image: 'assets/img/foto2.jpg',
      details: [
        { label: 'Tipo de daño', value: 'Perforante' },
        { label: 'Cadencia', value: 'Semi-Auto' },
        { label: 'Precisión', value: 'Alta' },
      ],
    },
    {
      title: 'Nueva Misión: Steel Path',
      category: 'CONTENIDO',
      description:
        'Enfréntate a enemigos de nivel superior y obtén recompensas exclusivas en el modo difícil.',
      image: 'assets/img/foto.png',
      details: [
        { label: 'Dificultad', value: 'Extrema' },
        { label: 'Recompensas', value: 'Exclusivas' },
        { label: 'Nivel enemigos', value: '100+' },
      ],
    },
    {
      title: 'Syandana Tengus',
      category: 'COSMÉTICA',
      description:
        'Capa elegante inspirada en diseños Orokin, con efectos de partículas reactivos a tus movimientos.',
      image: 'assets/img/foto.png',
      details: [
        { label: 'Rareza', value: 'Legendaria' },
        { label: 'Personalizable', value: '3 canales de color' },
        { label: 'Efectos', value: 'Dinámicos con el movimiento' },
      ],
    },
    {
      title: 'Evento Especial: Plague Star',
      category: 'EVENTOS',
      description:
        'Defiende las llanuras de Eidolon contra la infestación y gana recompensas únicas por tiempo limitado.',
      image: 'assets/img/foto.png',
      details: [
        { label: 'Duración', value: '2 semanas' },
        { label: 'Ubicación', value: 'Cetus' },
        { label: 'Recompensas', value: 'Forma, Armas Zaw, Decoraciones' },
      ],
    },
    {
      title: 'Prime Access: Revenant Prime',
      category: 'PRIME',
      description:
        'Versión mejorada del maestro del Eidolon con estadísticas superiores y estética dorada premium.',
      image: 'assets/img/foto.png',
      details: [
        { label: 'Armadura', value: '175 (Base)' },
        { label: 'Energía', value: '150 (Base)' },
        { label: 'Polaridades', value: '3 preinstaladas' },
      ],
    },
  ];

  ngOnInit(): void {
    // Asegúrate de que hay suficientes elementos de showcase para cada imagen
    if (this.showcaseItems.length < this.images.length) {
      // Rellenar con elementos duplicados si es necesario
      const diff = this.images.length - this.showcaseItems.length;
      for (let i = 0; i < diff; i++) {
        this.showcaseItems.push({
          ...this.showcaseItems[i % this.showcaseItems.length],
        });
      }
    }
  }

  // Método para seleccionar un elemento
  selectItem(index: number): void {
    this.currentIndex = index;
  }
}
