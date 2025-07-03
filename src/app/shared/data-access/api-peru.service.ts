import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiPeruService {
  private readonly apiUrl = 'https://apiperu.dev/api/dni/';
  private readonly token =
    '4275545bbeee03d830e4ecc5fa6bae517c960f35e35f16b7b1080ab05b39197f';

  constructor(private readonly http: HttpClient) {}

  buscarPorDni(dni: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get(`${this.apiUrl}${dni}`, { headers });
  }
}

