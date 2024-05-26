import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://54.235.56.148:8080';  

  constructor(private http: HttpClient) { }

  createTransaction(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/crear_transaccion`, data, { headers });
  }

  getTransactionResult(token_ws: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/return`, { params: { token_ws } });
  }
}
