import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './views/register/register.component';
import { WarehouseComponent } from './views/warehouse/warehouse.component';
import { GraphicsComponent } from './views/graphics/graphics.component';

//MODIFICAR, LAS RUTAS NO ESTAN PROTEGIDAS, AÑADIR --> canActivate: [AuthGuard] 
export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'warehouse', component: WarehouseComponent },
    { path: 'graphics', component: GraphicsComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  