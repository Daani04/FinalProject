import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent }//No se protege por que es la ruta a la que se dirige en caso de no tener un usuario autentificado
];

// Este módulo configura y gestiona las rutas de la aplicación.
// Utiliza el RouterModule para definir las rutas principales en la aplicación,
// y hace que el enrutamiento esté disponible en toda la aplicación mediante la exportación del RouterModule.
@NgModule({
    imports: [RouterModule.forRoot(routes)], // Configura el enrutador con las rutas definidas en el arreglo 'routes'.
    exports: [RouterModule] // Hace que las funcionalidades de enrutamiento (como routerLink y router-outlet) estén disponibles globalmente.
  })
  export class AppRoutingModule { }
  