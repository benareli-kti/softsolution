import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Store } from '../models/store.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'stores';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Store[]> {
    return this.http.get<Store[]>(baseUrl);
  }
  getTable(): Observable<Store[]>{
    return this.http.get(baseUrl)
      .pipe(map((response: any) => response.data as Store[]))
  }
  get(id: any): Observable<Store> {
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
  findAllActive(): Observable<Store[]>{
    return this.http.get<Store[]>(`${baseUrl}/active`);
  }
}