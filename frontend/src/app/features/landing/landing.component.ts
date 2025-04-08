import { Component } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { SliderComponent } from './components/slider/slider.component';
import { PublicityComponent } from './components/publicity/publicity.component';
import { HeaderComponent } from './components/header/header.component';
import { Seccion1Component } from './components/seccion-1/seccion-1.component';
import { Seccion2Component } from './components/seccion-2/seccion-2.component';
import { Seccion3Component } from './components/seccion-3/seccion-3.component';
import { Notice1Component } from './components/notice-1/notice-1.component';
import { Notice2Component } from './components/notice-2/notice-2.component';
import { Notice3Component } from './components/notice-3/notice-3.component';
import { Notice4Component } from './components/notice-4/notice-4.component';
import { Notice5Component } from './components/notice-5/notice-5.component';
import { Notice6Component } from './components/notice-6/notice-6.component';
import { CardModule } from 'primeng/card';
import { CtaComponent } from './components/cta/cta.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    FooterComponent,
    SliderComponent,
    PublicityComponent,
    HeaderComponent,
    Seccion1Component,
    Seccion2Component,
    Seccion3Component,
    Notice1Component,
    Notice2Component,
    Notice3Component,
    Notice4Component,
    Notice5Component,
    Notice6Component,
    CtaComponent,
    CardModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export default class LandingComponent {}
