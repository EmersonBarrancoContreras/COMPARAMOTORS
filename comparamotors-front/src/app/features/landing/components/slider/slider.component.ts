import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CarouselModule, ButtonModule, TagModule, CommonModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SliderComponent {}
