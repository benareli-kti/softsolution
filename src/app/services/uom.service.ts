import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Uom } from '../models/uom.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'uoms';
 
@Injectable({
  providedIn: 'root'
})
export class UomService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Uom[]> {
    return this.http.get<Uom[]>(baseUrl);
  }
  getTable(): Observable<Uom[]>{
    return this.http.get(baseUrl)
      .pipe(map((response: any) => response.data as Uom[]))
  }
  get(id: any): Observable<Uom> {
    return this.http.get(`${baseUrl}/${id}`);
  }
  getByCat(uomcat: any): Observable<Uom[]> {
    return this.http.get<Uom[]>(`${baseUrl}/uomcat/${uomcat}`);
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }
}
