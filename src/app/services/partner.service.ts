import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Partner } from '../models/partner.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'partners';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Partner[]> {
    return this.http.get<Partner[]>(baseUrl);
  }
  getTable(): Observable<Partner[]>{
    return this.http.get(baseUrl)
      .pipe(map((response: any) => response.data as Partner[]))
  }
  get(id: any): Observable<Partner> {
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
  findAllActive(): Observable<Partner[]>{
    return this.http.get<Partner[]>(`${baseUrl}/active`);
  }
  findAllActiveCustomer(): Observable<Partner[]>{
    return this.http.get<Partner[]>(`${baseUrl}/activecustomer`);
  }
  findAllActiveSupplier(): Observable<Partner[]>{
    return this.http.get<Partner[]>(`${baseUrl}/activesupplier`);
  }
  findByDesc(name: any): Observable<Partner[]> {
    return this.http.get<Partner[]>(`${baseUrl}?name=${name}`);
  }
}