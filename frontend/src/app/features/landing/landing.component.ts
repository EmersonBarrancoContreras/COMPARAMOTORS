import { Component } from '@angular/core';
import { FooterComponent } from "./components/footer/footer.component";
import { SliderComponent } from "./components/slider/slider.component";
import { PublicityComponent } from "./components/publicity/publicity.component";
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FooterComponent, SliderComponent, PublicityComponent, HeaderComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export default class LandingComponent {

}
