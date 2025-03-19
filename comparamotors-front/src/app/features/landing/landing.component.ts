import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import HeaderComponent from './components/header/header.component';
import { SliderComponent } from './components/slider/slider.component';
import { CardNationalComponent } from './components/card-national/card-national.component';
import { CardInternationalComponent } from './components/card-international/card-international.component';
import { CardRelevantComponent } from './components/card-relevant/card-relevant.component';
import { CardNewComponent } from './components/card-new/card-new.component';
import { FooterComponent } from './components/footer/footer.component';
import { PublicidadComponent } from './components/publicidad/publicidad.component';
import { SectionsComponent } from "./components/sections/sections.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    SliderComponent,
    CardNationalComponent,
    CardInternationalComponent,
    CardRelevantComponent,
    FooterComponent,
    PublicidadComponent,
    SectionsComponent
],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export default class LandingComponent {}
