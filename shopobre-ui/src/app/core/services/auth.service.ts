import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LoginRequest } from '../models/auth.model';
import { SessionStorage } from './session-storage/session-storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private api: ApiService,
    private sessionStorage: SessionStorage,
  ) {}

  private readonly TOKEN_KEY = 'access_token';

  private get url() {
    return `${this.api.getBaseUrl()}/auth/login`;
  }

  login(authData: LoginRequest) {
    return this.http.post(this.url, authData);
  }

  setToken(token: string): void {
    this.sessionStorage.set(this.TOKEN_KEY, token);
  }

  getUserRole(): string | null {
    const token = sessionStorage.getItem('access_token');
    if (typeof token !== 'string' || !token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  }

  getUserId(): string | null {
    const token = this.sessionStorage.get(this.TOKEN_KEY);

    if (typeof token !== 'string' || !token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return null;
    }
  }

  getToken() {
    return this.sessionStorage.get(this.TOKEN_KEY);
  }
}
