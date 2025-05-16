import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';

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
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [],
})
export class HeaderComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;

  items: MenuItem[] | undefined;
  isMenuActive: boolean = false;
  isSearchActive: boolean = false;

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;

    // Si el buscador se activa, enfoca el input
    if (this.isSearchActive) {
      setTimeout(() => {
        this.searchInput?.nativeElement?.focus();
      }, 100);
    }
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value.trim()) {
      console.log('Buscando:', value);
      // Aquí puedes implementar la lógica de búsqueda
    }
  }

  onSearchBlur() {
    // Opcional: cerrar el buscador cuando pierde el foco
    // Descomenta la siguiente línea si quieres esta funcionalidad
    // setTimeout(() => this.isSearchActive = false, 200);
  }

  ngOnInit() {}
}
