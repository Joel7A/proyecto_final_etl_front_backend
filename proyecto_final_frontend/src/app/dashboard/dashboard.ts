import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AlumnoService } from '../alumno-service';
import Chart from 'chart.js/auto';

@Component({
  imports: [MatCardModule],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements AfterViewInit {
  @ViewChild('graficoBarras') barrasRef!: ElementRef;
  @ViewChild('graficoTorta') tortaRef!: ElementRef;

  chartBarras: any;
  chartTorta: any;

  constructor(private alumnoService: AlumnoService) {}

  ngAfterViewInit(): void {
    this.alumnoService.obtenerAlumnos().subscribe({
      next: (alumnos) => {
        this.dibujarGraficoBarras(alumnos);
        this.dibujarGraficoTorta(alumnos);
      },
      error: (error) => {
        console.error('Error al obtener alumnos: ', error);
      },
    });
  }

  dibujarGraficoBarras(alumnos: any[]) {
    const facultades = [
      'Administración',
      'Derecho',
      'Ingeniería De Producción Y Servicios',
      'Ingeniería De Sistemas',
      'Medicina',
    ];
    const alumnosPorFacultad = facultades.map((fac) => {
      return alumnos.filter((a) => a.facultad === fac).length;
    });

    this.chartBarras = new Chart(this.barrasRef.nativeElement, {
      type: 'bar',
      data: {
        labels: facultades,
        datasets: [
          {
            label: 'Cantidada de alumnos',
            data: alumnosPorFacultad,
            backgroundColor: ['#519872', '#533747', '#8c1a6a', '#01295f', '#42cafd'],
            borderRadius: 6,
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });
  }

  dibujarGraficoTorta(alumnos: any[]) {
    const alumnosDestacados = alumnos.filter((a) => a.estado_academico === 'Destacado').length;
    const alumnosRegulares = alumnos.filter((a) => a.estado_academico === 'Regular').length;
    const alumnosEnRiesgo = alumnos.filter((a) => a.estado_academico === 'Riesgo academico').length;

    this.chartTorta = new Chart(this.tortaRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Destacado', 'Regular', 'Riesgo'],
        datasets: [
          {
            data: [alumnosDestacados, alumnosRegulares, alumnosEnRiesgo],
            backgroundColor: ['#4caf50', '#ff9800', '#ff4045'],
            borderWidth: 2,
          },
        ],
      },
      options: { responsive: true },
    });
  }
}
