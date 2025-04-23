import { Component } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { SliderComponent } from './components/slider/slider.component';
import { InformationComponent } from './components/information/publicity.component';
import { HeaderComponent } from './components/header/header.component';
import { Seccion1Component } from './components/seccion-1/seccion-1.component';
import { Seccion2Component } from './components/seccion-2/seccion-2.component';
import { Seccion3Component } from './components/seccion-3/seccion-3.component';
import { Seccion4Component } from './components/seccion-4/seccion-4.component';
import { Seccion5Component } from './components/seccion-5/seccion-5.component';
import { CardModule } from 'primeng/card';
import { CtaComponent } from './components/cta/cta.component';
import { NewsComponent } from '../../shared/components/news/news.component';
import { PublicityComponent } from './components/publicity/publicity.component';
import { NewsInfiniteComponent } from "../../shared/components/news-infinite/news-infinite.component";

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
    Seccion4Component,
    Seccion5Component,
    PublicityComponent,
    CtaComponent,
    CardModule,
    NewsComponent,
    NewsInfiniteComponent
],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export default class LandingComponent {}
