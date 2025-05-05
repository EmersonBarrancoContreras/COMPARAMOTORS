import { Component, OnInit } from '@angular/core';
import { CardsComponent } from '../cards/cards.component';
import { CommonModule } from '@angular/common';
import { News } from '@shared/interfaces/new';

@Component({
  selector: 'app-news',
  imports: [CardsComponent, CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export default class NewsComponent implements OnInit {
  newsItems: News[] = [];

  ngOnInit(): void {
    this.newsItems = [
      {
        id: '1',
        title: 'Nuevos modelos de autos eléctricos 2024',
        description:
          'Descubre los nuevos modelos de autos eléctricos que llegarán al mercado en 2024, con mejoras en autonomía y diseño.',
        image: 'assets/img/1.png',
        date: new Date(),
        author: 'Carlos Pérez',
        category: 'Eléctricos',
      },
      {
        id: '2',
        title: 'Comparativa de SUVs compactos',
        description:
          'Analizamos los mejores SUVs compactos del mercado, comparando prestaciones, consumo y relación calidad-precio.',
        image: 'assets/img/2.png',
        date: new Date(),
        author: 'Ana Gómez',
        category: 'SUV',
      },
      {
        id: '3',
        title: 'Consejos para el mantenimiento de tu auto',
        description:
          'Aprende los mejores consejos para mantener tu auto en óptimas condiciones y prolongar su vida útil.',
        image: 'assets/img/3.png',
        date: new Date(),
        author: 'Luis Martínez',
        category: 'Mantenimiento',
      },
      {
        id: '4',
        title: 'Tendencias en tecnología automotriz 2024',
        description:
          'Explora las últimas tendencias en tecnología automotriz, desde vehículos autónomos hasta conectividad avanzada.',
        image: 'assets/img/6.png',
      },
      {
        id: '5',
        title: 'Los mejores autos deportivos del año',
        description:
          'Descubre los mejores autos deportivos del año, con un análisis de su rendimiento y diseño.',
        image: 'assets/img/7.png',
        date: new Date(),
        author: 'María López',
        category: 'Deportivos',
      },
      {
        id: '6',
        title: 'Guía de compra de autos híbridos',
        description:
          'Todo lo que necesitas saber para elegir el auto híbrido perfecto para ti, desde precios hasta características.',
        image: 'assets/img/8.png',
        date: new Date(),
        author: 'Javier Torres',
        category: 'Híbridos',
      },
      {
        id: '7',
        title: 'Los autos más esperados de 2024',
        description:
          'Un vistazo a los autos más esperados que llegarán al mercado en 2024, con sus características y precios.',
        image: 'assets/img/9.png',
        date: new Date(),
        author: 'Patricia Ruiz',
        category: 'Lanzamientos',
      },
      {
        id: '8',
        title: 'Impacto del cambio climático en la industria automotriz',
        description:
          'Analizamos cómo el cambio climático está afectando a la industria automotriz y las medidas que se están tomando.',
        image: 'assets/img/10.png',
        date: new Date(),
        author: 'Fernando Díaz',
        category: 'Sostenibilidad',
      },
    ];
  }

  onNewsClick(news: any): void {
    // Aquí puedes manejar el evento de clic en una noticia
    console.log('Noticia clickeada:', news);
  }
}
