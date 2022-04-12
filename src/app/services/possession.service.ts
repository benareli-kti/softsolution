import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Possession } from '../models/possession.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'possessions';

@Injectable({
  providedIn: 'root'
})
export class PossessionService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Possession[]> {
    return this.http.get<Possession[]>(baseUrl);
  }
  get(id: any): Observable<Possession> {
    return this.http.get(`${baseUrl}/?id=${id}`);
  }
  getUser(user: any): Observable<Possession> {
    return this.http.get(`${baseUrl}/user/${user}`);
  }
  getUserOpen(user: any): Observable<Possession[]> {
    return this.http.get<Possession[]>(`${baseUrl}/openuser/${user}`);
  }
  getUserClose(user: any): Observable<Possession[]> {
    return this.http.get<Possession[]>(`${baseUrl}/closeuser/${user}`);
  }
  getAllOpen(): Observable<Possession[]> {
    return this.http.get<Possession[]>(`${baseUrl}/allopen`);
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