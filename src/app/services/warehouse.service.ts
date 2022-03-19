import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Warehouse } from '../models/warehouse.model';

const baseUrl = 'http://0.0.0.0:8080/api/warehouses';

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
  findByDesc(name: any): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${baseUrl}?name=${name}`);
  }
}