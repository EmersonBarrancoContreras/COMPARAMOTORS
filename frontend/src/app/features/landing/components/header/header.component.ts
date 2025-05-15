import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ButtonModule,
    MenuModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    MenubarModule,
    DialogModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [],
})
export class HeaderComponent implements OnInit {
  visible: boolean = false;
  items: MenuItem[] | undefined;
  isMenuActive: boolean = false;

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }

  position:
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'center'
    | 'topleft'
    | 'topright'
    | 'bottomleft'
    | 'bottomright' = 'center';

  showDialog(
    position:
      | 'left'
      | 'right'
      | 'top'
      | 'bottom'
      | 'center'
      | 'topleft'
      | 'topright'
      | 'bottomleft'
      | 'bottomright'
  ) {
    this.position = position;
    this.visible = true;
  }

  ngOnInit() {}
}
