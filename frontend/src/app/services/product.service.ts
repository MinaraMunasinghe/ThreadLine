import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Product, ProductCategory, CreateProductDto, UpdateProductDto } from '../core/models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  getAll(category?: ProductCategory | 'All'): Observable<Product[]> {
    let params = new HttpParams();
    if (category && category !== 'All') {
      params = params.set('category', category);
    }
    return this.http.get<Product[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, dto, {
      headers: { 'x-admin-key': environment.adminApiKey },
    });
  }

  update(id: string, dto: UpdateProductDto): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, dto, {
      headers: { 'x-admin-key': environment.adminApiKey },
    });
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: { 'x-admin-key': environment.adminApiKey },
    });
  }
}
