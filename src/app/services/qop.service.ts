import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Qop } from '../models/qop.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'qops';

@Injectable({
  providedIn: 'root'
})
export class QopService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Qop[]> {
    return this.http.get<Qop[]>(baseUrl);
  }
  getTable(): Observable<Qop[]>{
    return this.http.get(baseUrl)
      .pipe(map((response: any) => response.data as Qop[]))
  }
  get(id: any): Observable<Qop> {
    return this.http.get(`${baseUrl}/${id}`);
  }
  getProd(product: any, warehouse: any): Observable<Qop[]> {
    return this.http.get<Qop[]>(`${baseUrl}/prod/${product}/${warehouse}`);
  }
  findByProduct(product: any): Observable<Qop[]> {
    return this.http.get<Qop[]>(`${baseUrl}?product=${product}`);
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
  createUpdate(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/cu`, data);
  }
}