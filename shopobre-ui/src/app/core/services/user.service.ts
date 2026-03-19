import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private api: ApiService,
    private router: Router,
    private authService: AuthService,
  ) {}

  private get url() {
    return `${this.api.getBaseUrl()}/users`;
  }

  signup(userData: User) {
    return this.http.post(this.url, userData);
  }

  logout(): void {
    sessionStorage.removeItem('access_token');
    this.router.navigate(['login']);
  }

  getUser() {
    const userID = this.authService.getUserId();
    const userGETURL = `${this.url}/${userID}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });

    return this.http.get(userGETURL, { headers });
  }

  updateUser(userData: any) {
    const userID = this.authService.getUserId();
    const userGETURL = `${this.url}/${userID}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });

    return this.http.put(userGETURL, userData, { headers });

  }
}
