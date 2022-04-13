import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Productcat } from '../models/productcat.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'productcats';

@Injectable({
  providedIn: 'root'
})
export class ProductCatService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Productcat[]> {
    return this.http.get<Productcat[]>(baseUrl);
  }
  getTable(): Observable<Productcat[]>{
    return this.http.get(baseUrl)
      .pipe(map((response: any) => response.data as Productcat[]))
  }
  get(id: any): Observable<Productcat> {
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
  findByCatId(catid: any): Observable<Productcat[]> {
    return this.http.get<Productcat[]>(`${baseUrl}?catid=${catid}`);
  }
  findAllActive(): Observable<Productcat[]>{
    return this.http.get<Productcat[]>(`${baseUrl}/active`);
  }
  findByDesc(description: any): Observable<Productcat[]> {
    return this.http.get<Productcat[]>(`${baseUrl}?description=${description}`);
  }
}