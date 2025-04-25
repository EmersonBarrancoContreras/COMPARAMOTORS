import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, Menu],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [],
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        items: [
          {
            label: 'Login',
            icon: 'pi pi-sign-in',
          },
          {
            label: 'Profile',
            icon: 'pi pi-user',
          },
        ],
      },
    ];
  }
}
