import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Warehouse } from '../models/warehouse.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'warehouses';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(baseUrl);
  }
  getTable(): Observable<Warehouse[]>{
    return this.http.get(baseUrl)
      .pipe(map((response: any) => response.data as Warehouse[]))
  }
  get(id: any): Observable<Warehouse> {
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
  findAllActive(): Observable<Warehouse[]>{
    return this.http.get<Warehouse[]>(`${baseUrl}/active`);
  }
  findMain(): Observable<Warehouse[]>{
    return this.http.get<Warehouse[]>(`${baseUrl}/main`);
  }
  findByDesc(name: any): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${baseUrl}?name=${name}`);
  }
}