import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private get url() {
    return `${this.api.getBaseUrl()}/categories`;
  }

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {}

  getById(id: number): Observable<Category | null> {
    return this.http.get<Category>(`${this.url}/${id}`).pipe(
      catchError(() => of(null))
    );
  }
}
