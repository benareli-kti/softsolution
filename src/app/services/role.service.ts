import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Role } from '../models/role.model';
import { BaseURL } from 'src/app/baseurl';

const baseUrl = BaseURL.BASE_URL + 'userrole';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(baseUrl);
  }
  get(id: any): Observable<Role> {
    return this.http.get(`${baseUrl}/${id}`);
  }
}
