import { ChangeDetectorRef, Component, inject, Inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TablaAlumnos } from '../tabla-alumnos/tabla-alumnos';
import { AlumnoService } from '../alumno-service';

@Component({
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatSelectModule, TablaAlumnos],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private alumnoService = inject(AlumnoService);
  private cdr = inject(ChangeDetectorRef);

  alumnosEnPantalla: any[] = [];
  alumnosOriginales: any[] = [];

  ngOnInit(): void {
    this.alumnoService.obtenerAlumnos().subscribe({
      next: (alumnos) => {
        this.alumnosEnPantalla = alumnos;
        this.alumnosOriginales = alumnos;

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar alumnos: ', err),
    });
  }

  //revisar...Rv-01 = facultad
  filtrarPorFacultad(facultad: string) {
    if (facultad === 'Todos') {
      this.alumnosEnPantalla = this.alumnosOriginales;
    } else {
      this.alumnosEnPantalla = this.alumnosOriginales.filter(
        (a) =>
          a.facultad === facultad &&
          a.facultad.trim().toLowerCase() === facultad.trim().toLowerCase(),
      );
    }
  }
}
