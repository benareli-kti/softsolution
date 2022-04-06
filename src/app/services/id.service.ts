import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Id } from '../models/id.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'ids';

@Injectable({
  providedIn: 'root'
})
export class IdService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Id[]> {
    return this.http.get<Id[]>(baseUrl);
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }
}