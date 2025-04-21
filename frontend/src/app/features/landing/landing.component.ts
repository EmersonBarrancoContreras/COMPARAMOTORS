import { Component } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { SliderComponent } from './components/slider/slider.component';
import { PublicityComponent } from './components/publicity/publicity.component';
import { HeaderComponent } from './components/header/header.component';
import { Seccion1Component } from './components/seccion-1/seccion-1.component';
import { Seccion2Component } from './components/seccion-2/seccion-2.component';
import { Seccion3Component } from './components/seccion-3/seccion-3.component';
import { CardModule } from 'primeng/card';
import { CtaComponent } from './components/cta/cta.component';
import { NewsComponent } from '../../shared/components/news/news.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    FooterComponent,
    SliderComponent,
    HeaderComponent,
    Seccion1Component,
    Seccion2Component,
    Seccion3Component,
    CtaComponent,
    CardModule,
    NewsComponent,
    ModalComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export default class LandingComponent {}
