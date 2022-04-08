import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Posdetail } from '../models/posdetail.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'posdetails';

@Injectable({
  providedIn: 'root'
})
export class PosdetailService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Posdetail[]> {
    return this.http.get<Posdetail[]>(baseUrl);
  }
  get(id: any): Observable<Posdetail> {
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
}