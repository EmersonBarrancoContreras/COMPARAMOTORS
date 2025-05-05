import { Component } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import SliderComponent from './components/slider/slider.component';
import { HeaderComponent } from './components/header/header.component';
import { Seccion1Component } from './components/seccion-1/seccion-1.component';
import { CardModule } from 'primeng/card';
import { CtaComponent } from './components/cta/cta.component';
import { PublicityComponent } from './components/publicity/publicity.component';
import NewsInfiniteComponent from '@shared/components/news-infinite/news-infinite.component';
import NewsComponent from '@shared/components/news/news.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    FooterComponent,
    SliderComponent,
    HeaderComponent,
    Seccion1Component,
    PublicityComponent,
    CardModule,
    NewsComponent,
    NewsInfiniteComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export default class LandingComponent {}
