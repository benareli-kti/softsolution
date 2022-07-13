import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Uomcat } from '../models/uomcat.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'uomcats';
 
@Injectable({
  providedIn: 'root'
})
export class UomcatService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Uomcat[]> {
    return this.http.get<Uomcat[]>(baseUrl);
  }
  getTable(): Observable<Uomcat[]>{
    return this.http.get(baseUrl)
      .pipe(map((response: any) => response.data as Uomcat[]))
  }
  get(id: any): Observable<Uomcat> {
    return this.http.get(`${baseUrl}/${id}`);
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }
}
