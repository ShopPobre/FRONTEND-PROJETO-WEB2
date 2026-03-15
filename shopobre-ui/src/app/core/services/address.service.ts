import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(
    private http: HttpClient,
    private api: ApiService,
    private router: Router,
    private authService: AuthService,
  ) {}

  private get url() {
    return `${this.api.getBaseUrl()}/users`;
  }

  getAddress() {
    const userID = this.authService.getUserId();
    const userGETURL = `${this.url}/${userID}/addresses`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });

    return this.http.get(userGETURL, { headers });
  }

  createAddress(addressData: any){
    const userID = this.authService.getUserId();
    const userGETURL = `${this.url}/${userID}/addresses`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });

    return this.http.post(userGETURL, addressData, { headers });
  }

  updateAddress(addressID: string, addressData: any){
    const userID = this.authService.getUserId();
    const userGETURL = `${this.url}/${userID}/addresses/${addressID}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    
    return this.http.put(userGETURL, addressData, { headers });
  }
}
