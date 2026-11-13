import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    RouterLink,
  ],
  selector: 'app-tabla-alumnos',
  styleUrl: './tabla-alumnos.css',
  templateUrl: './tabla-alumnos.html',
})
export class TablaAlumnos {
  @Input() set lista(value: any[]) {
    this.dataSource.data = value;
  }

  columnas: string[] = [
    'id_alumno',
    'nombre_completo',
    'facultad',
    'carrera',
    'semestre',
    'promedio_ponderado',
    'acciones',
  ];
  dataSource = new MatTableDataSource<any>([]);
}
