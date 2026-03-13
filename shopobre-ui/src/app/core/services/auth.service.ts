import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LoginRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private api: ApiService,
  ) {}

  private get url() {
    return `${this.api.getBaseUrl()}/auth/login`;
  }

  login(authData: LoginRequest) {
    return this.http.post(this.url, authData);
  }
}
