import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Stockmove } from '../models/stockmove.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'stockmoves';

@Injectable({
  providedIn: 'root'
})
export class StockmoveService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Stockmove[]> {
    return this.http.get<Stockmove[]>(baseUrl);
  }
  getTable(): Observable<Stockmove[]>{
    return this.http.get(baseUrl)
      .pipe(map((response: any) => response.data as Stockmove[]))
  }
  get(id: any): Observable<Stockmove> {
    return this.http.get(`${baseUrl}/${id}`);
  }
  getProd(product: any): Observable<Stockmove[]> {
    return this.http.get<Stockmove[]>(`${baseUrl}/prod/${product}`);
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
}
