import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Product } from '../models/product.model';

const baseUrl = 'http://127.0.0.1:8080/api/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(baseUrl);
  }
  getTable(): Observable<Product[]>{
    return this.http.get(baseUrl)
      .pipe(map((response: any) => response.data as Product[]))
  }
  get(id: any): Observable<Product> {
    return this.http.get(`${baseUrl}/${id}`);
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }
  findAllActive(): Observable<Product[]>{
    return this.http.get<Product[]>(`${baseUrl}/active`);
  }
  findByCatId(sku: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}?sku=${sku}`);
  }
  findByDesc(name: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}?name=${name}`);
  }
}