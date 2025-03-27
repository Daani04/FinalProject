import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

//API

  private apiUrl = 'https://api.deepseek.com/v1/chat/completions';  
  private apiKey = 'sk-5d63c70259c44663a0b30b554d62c2bd';  

  sendMessage(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      model: 'deepseek-chat',  // MODELO QUE SE VA A USAR 
      messages: [{ role: 'user', content: prompt }]
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }

}
