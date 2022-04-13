import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Brand } from '../models/brand.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'brands';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Brand[]> {
    return this.http.get<Brand[]>(baseUrl);
  }
  getTable(): Observable<Brand[]>{
    return this.http.get(baseUrl)
      .pipe(map((response: any) => response.data as Brand[]))
  }
  get(id: any): Observable<Brand> {
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
  findAllActive(): Observable<Brand[]>{
    return this.http.get<Brand[]>(`${baseUrl}/active`);
  }
  findByDesc(description: any): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${baseUrl}?description=${description}`);
  }
}