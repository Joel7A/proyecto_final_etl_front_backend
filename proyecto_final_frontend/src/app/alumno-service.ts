import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Alumno {
  id_alumno: string;
  nombre_completo: string;
  facultad: string;
  carrera: string;
  semestre: number;
  promedio_ponderado: number;
  creditos_matriculados: number;
  estado_academico: string;
  condicion_beca: string;
}

@Injectable({ providedIn: 'root' })
export class AlumnoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/alumnos';

  obtenerAlumnos(): Observable<Alumno[]> {
    //recordar: un obserbable no hara nada hasta que uno se suscribe
    return this.http.get<Alumno[]>(this.apiUrl);
  }

  obtenerAlumnoPorId(id_alumno: string): Observable<Alumno | undefined> {
    return this.obtenerAlumnos().pipe(
      map((alumnos) =>
        alumnos.find(
          (alumno) =>
            String(alumno.id_alumno).trim().toLowerCase() ===
            String(id_alumno).trim().toLowerCase(),
        ),
      ),
    );
  }
}
