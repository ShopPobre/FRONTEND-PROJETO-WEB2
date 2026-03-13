import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private api: ApiService,
  ) {}

  private get url() {
    return `${this.api.getBaseUrl()}/users`;
  }

  signup(userData: User) {
    return this.http.post(this.url, userData);
  }
}
