import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Product } from '../models/product.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'products';

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
  createMany(user: any, data: any): Observable<any> {
    return this.http.post(`${baseUrl}/many?user=${user}`, data);
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
  findAllStock(): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/stock`);
  }
  findAllActiveStock(): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/activestock`);
  }
  findByDesc(name: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}?name=${name}`);
  }
}