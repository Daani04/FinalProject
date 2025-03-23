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

  public loginUser(url: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(url, { email, password });
  }

  public createWarehouse(url: string, warehouseData: Warehouse): Observable<any> {
    return this.http.post<any>(url, warehouseData);
}

}
