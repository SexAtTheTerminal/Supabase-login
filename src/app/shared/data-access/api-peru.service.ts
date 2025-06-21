import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiPeruService {
  private apiUrl = 'https://apiperu.dev/api/dni/';
  private token = '4275545bbeee03d830e4ecc5fa6bae517c960f35e35f16b7b1080ab05b39197f';

  constructor(private http: HttpClient) {}

  buscarPorDni(dni: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get(`${this.apiUrl}${dni}`, { headers });
  }
}
