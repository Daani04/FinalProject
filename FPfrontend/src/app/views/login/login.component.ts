import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private dataUser(email: string, password: string, remember: boolean): void {
    localStorage.setItem('user', email);
    localStorage.setItem('password', password);
    localStorage.setItem('remember', String(remember));  // Convierte el booleano a string

    console.log('User:', email);
    console.log('Password:', password);
    console.log('Remember:', remember);
  }

  reactiveForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    rememberMe: new FormControl('')
  });

  public onSubmit(): void {
    let email: string = this.reactiveForm.value.email ?? '';
    let password: string = this.reactiveForm.value.password ?? '';
    let remember: boolean = !!this.reactiveForm.value.rememberMe;  //Formzar el valor a booleno(no deja tratarlo como string)
    this.dataUser(email, password, remember);
  }
}
