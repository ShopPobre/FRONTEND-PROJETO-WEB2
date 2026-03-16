import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, switchMap, of } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Category, CategoryResponse } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private api = inject(ApiService);
  private authService = inject(AuthService);

  private get url() {
    return `${this.api.getBaseUrl()}/categories`;
  }

  private get headers() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }

  getById(id: number): Observable<Category | null> {
    return this.http.get<Category>(`${this.url}/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<CategoryResponse>(this.url, { headers: this.headers }).pipe(
      map((response) => response.data ?? [])
    );
  }

  getCategoriesPublic(): Observable<Category[]> {
    return this.http.get<CategoryResponse>(this.url).pipe(
      map((response) => response.data ?? []),
      catchError(() => of([] as Category[]))
    );
  }

  createCategory(name: string): Observable<Category> {
    return this.http.post<Category>(this.url, { name }, { headers: this.headers });
  }

  findOrCreate(name: string): Observable<Category> {
    return this.getCategories().pipe(
      switchMap((categories) => {
        const found = categories.find(
          (c) => c.name.toLowerCase() === name.toLowerCase()
        );
        if (found) {
          return of(found);
        }
        return this.createCategory(name);
      })
    );
  }
}
