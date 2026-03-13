import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private api: ApiService,
    private router: Router
  ) {}

  private get url() {
    return `${this.api.getBaseUrl()}/users`;
  }

  signup(userData: User) {
    return this.http.post(this.url, userData);
  }

  logout(): void {
    sessionStorage.removeItem('access_token');
    this.router.navigate(['login'])
  }
}
