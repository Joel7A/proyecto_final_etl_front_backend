import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Alumno, AlumnoService } from '../alumno-service';

@Component({
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatDividerModule],
  selector: 'app-detalle-alumno',
  styleUrl: './detalle-alumno.css',
  templateUrl: './detalle-alumno.html',
})
export class DetalleAlumno implements OnInit {
  alumnoSeleccionado: Alumno | undefined;

  constructor(
    private route: ActivatedRoute,
    private alumnoService: AlumnoService,
  ) {}

  ngOnInit(): void {
    const id_alumno = this.route.snapshot.paramMap.get('id_alumno');
    const alumnoEnviado = history.state?.alumno as Alumno | undefined;

    if (alumnoEnviado) {
      this.alumnoSeleccionado = alumnoEnviado;
    } else if (id_alumno) {
      this.alumnoService.obtenerAlumnoPorId(id_alumno).subscribe({
        next: (alumno) => {
          this.alumnoSeleccionado = alumno;
        },
        error: (error) => {
          console.error('Error al intentar obtener alumno: ', error);
        },
      });
    }
  }
}
