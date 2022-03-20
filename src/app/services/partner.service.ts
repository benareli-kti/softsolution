import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Partner } from '../models/partner.model';

const baseUrl = 'http://192.53.112.254:8080/api/partners';

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
  findByDesc(name: any): Observable<Partner[]> {
    return this.http.get<Partner[]>(`${baseUrl}?name=${name}`);
  }
}