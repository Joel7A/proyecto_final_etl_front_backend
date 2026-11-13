import { Routes } from '@angular/router';
import { Home } from './home/home';
import { DetalleAlumno } from './detalle-alumno/detalle-alumno';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  //path de las rutas
  { path: '', component: Home },
  { path: 'detalle-alumno/:id_alumno', component: DetalleAlumno },
  { path: 'alumno/:id_alumno', component: DetalleAlumno },
  { path: 'dashboard', component: Dashboard },
];
