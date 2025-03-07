import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Welcome, User, ProductAllData, ProductSold, Warehouse } from '../models/response.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(public http: HttpClient) { }

  public getUsers(url: string): Observable<User[]> {
    return this.http.get<User[]>(url);
  }
  
  public createUser(url: string, usuario: User): Observable<User> {
    return this.http.post<User>(url, usuario);
  }

}
