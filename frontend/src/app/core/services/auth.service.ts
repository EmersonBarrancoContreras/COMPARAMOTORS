import { Injectable, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs/internal/Observable';
import { isPlatformBrowser } from '@angular/common';

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface user {
  username: string;
  password: string;
  email: string;
  name: string;
  lastName: string;
  phoneNumber: number;
}

export interface RegisterData extends AuthCredentials {
  username: string;
  password: string;
  email: string;
  name: string;
  lastName: string;
  phoneNumber: number;
}

export interface AuthResponse {
  accessToken: string;
  user: user;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private accessToken = signal<string | null>(null);
  private userData = signal<user | null>(null);
  private readonly STORAGE = {
    TOKEN: 'token',
    USER: 'user',
    EMAIL: 'rememberedEmail',
  } as const;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly apiUrl = 'http://localhost:8080/api';

  constructor() {
    if (this.isBrowser) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        this.setUserData(token);
      }
    }
  }

  login(login: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, login);
  }

  register(register: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/users/register`,
      register
    );
  }

  ngOnInit() {}

  setUserData(token: string) {
    const decodedToken: any = jwtDecode(token);
    this.userData.set({
      username: decodedToken.sub,
      email: decodedToken.email,
      name: decodedToken.name,
      lastName: decodedToken.lastName,
      phoneNumber: decodedToken.phoneNumber,
      password: '',
    });
    this.accessToken.set(token);
  }

  logout() {
    this.userData.set(null);
    this.accessToken.set(null);
    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
    }
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  getUserData(): user | null {
    if (this.isBrowser) {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  setAccessToken(token: string) {
    if (this.isBrowser) {
      localStorage.setItem('accessToken', token);
    }
    this.accessToken.set(token);
  }

  setUserDataToLocalStorage(user: user) {
    if (this.isBrowser) {
      localStorage.setItem('userData', JSON.stringify(user));
    }
    this.userData.set(user);
  }

  getSavedEmail(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.STORAGE.EMAIL);
    }
    return null;
  }

  saveEmail(username: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE.EMAIL, username);
    }
  }

  removeSavedEmail() {
    if (this.isBrowser) {
      localStorage.removeItem(this.STORAGE.EMAIL);
    }
  }
}
