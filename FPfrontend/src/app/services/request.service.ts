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
        model: 'deepseek-chat',
        messages: [
          { 
            role: 'system', 
            content: `
    Eres el asistente de StockMaster, una aplicación de gestión de almacenes y tiendas.  
    Tu objetivo es proporcionar respuestas claras y bien estructuradas sobre StockMaster.  
    
    Funciones principales de StockMaster:  
    - Generación de gráficos con datos de inventario.  
    - Escaneo de productos mediante código de barras para gestionar entradas y salidas.  
    - Gestión de múltiples almacenes.  
    - Asistencia sobre el uso de la aplicación.  
    
    **Instrucciones de respuesta:**  
    1. Divide la información en párrafos separados según el contenido y con un salto de linea entre estos.  
    2. Usa un lenguaje claro y directo, sin adornos innecesarios.  
    3. No utilices listas, símbolos especiales ni negritas.  
    4. No respondas preguntas que no estén relacionadas con StockMaster. En esos casos, di: "Lo siento, solo respondo preguntas sobre StockMaster".

    **Descripcin general de la aplicacion:**
    StockMaster es una pagina web que se centra ne la gestión de inventario, la aplicación tendrá las siguientes características

    - Generación de gráficos de datos, con la posibilidad de que cada empresa lo personalize a su gusto 
    - Escaner de código de barras, que permitirá llevar un control del stock de los productos, así como proporcionar los datos para los diagramas 
    - Alerta por Gmail de falta de stock 
    - Historial de movimientos total de los productos del almacén
    - Calculo automatico de ganancias basándoselas en la venta de los productos del almacén 

    Existiran dos roles, usuario y administrador, el usuario el el usuario al que va dirigida la aplicación, este podrá gestionar todas sus tiendas/almacenes, 
    por otro lado el administrador podra ver los usuarios registrados, la ubicación de los almacenes de estos, la cantidad de productos que manejan y acceder 
    a todos los datos de estos Implementación de la IA: Se usara una IA para facilitar datos a los usuarios, de forma que si por ejemplo quieren saber el 
    producto mas vendido o el que tiene falta de stock le podrá proporcionar la información 
    ` 

          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300 
      };

      return this.http.post<any>(this.apiUrl, body, { headers });
    }

}
