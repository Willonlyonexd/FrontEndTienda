// src/app/services/recomendacion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecomendacionService {

  private readonly API_URL = '/api/recomendaciones';

  constructor(private http: HttpClient) { }

  // Obtener productos populares (general)
  obtenerProductosPopulares(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/populares`);
  }

  // ✅ Nuevo: Obtener productos recomendados (por cliente logeado)

}
