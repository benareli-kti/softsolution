import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Tax } from '../models/tax.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'taxs';
 
@Injectable({
  providedIn: 'root'
})
export class TaxService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Tax[]> {
    return this.http.get<Tax[]>(baseUrl);
  }
  getTable(): Observable<Tax[]>{
    return this.http.get(baseUrl)
      .pipe(map((response: any) => response.data as Tax[]))
  }
  get(id: any): Observable<Tax> {
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
  findAllActive(): Observable<Tax[]>{
    return this.http.get<Tax[]>(`${baseUrl}/active`);
  }
}