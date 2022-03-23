import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Qof } from '../models/qof.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'qofs';

@Injectable({
  providedIn: 'root'
})
export class QofService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Qof[]> {
    return this.http.get<Qof[]>(baseUrl);
  }
  getTable(): Observable<Qof[]>{
    return this.http.get(baseUrl)
      .pipe(map((response: any) => response.data as Qof[]))
  }
  get(id: any): Observable<Qof> {
    return this.http.get(`${baseUrl}/${id}`);
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
}
