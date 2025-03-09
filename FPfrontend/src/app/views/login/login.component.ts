import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { RequestService } from '../../services/request.service';  // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(public service: RequestService, private router: Router) { }

  public apiUrlUser: string = 'http://127.0.0.1:8000/api/user/login';  

  reactiveForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  public onSubmit(): void {
    this.loginUser();
  }

  public loginUser(): void {
    const email = this.reactiveForm.value.email ?? '';
    const password = this.reactiveForm.value.password ?? '';

    this.service.loginUser(this.apiUrlUser, email, password).subscribe(
      (response) => {
        console.log('Login exitoso:', response);
        localStorage.setItem('user', email);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error al hacer login:', error);
        alert('Credenciales incorrectas');
      }
    );
  }
}
