import { Component } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { FormsModule } from '@angular/forms';
import { json } from 'express';
import { ProductAllData } from '../../models/response.interface';

@Component({
  selector: 'app-deepseek',
  imports: [FormsModule],
  templateUrl: './deepseek.component.html',
  styleUrl: './deepseek.component.css',
  providers: [RequestService] // Para Standalone Components
})
export class DeepseekComponent {

  constructor(public service: RequestService) { }

  public apiProductsUrl: string = "http://localhost:8000/api/data";

  public products: ProductAllData[] = [];

  public userInput: string = '';
  public response: string = '';

  public placeHolderText: string = '';
  public arrayPlaceHolder: string[] = ['¿', 'E', 'n', ' ', 'q', 'u', 'e', ' ', 'p', 'u', 'e', 'd', 'o', ' ', 'a', 'y', 'u', 'd', 'a', 't', 'e', '?'];
  private currentIndex: number = 0;

  public answers: string[] = [];
  public questions: string[] = [];

  public loading: boolean = false;

  sendMessage() {
    this.loading = true;
    let editableDiv = document.querySelector('.editable') as HTMLDivElement; //Selecciona el contenido del input para vaciarlo posteriormente
    editableDiv.innerText = ''; // Esto vacía el contenido del div editable
    let prompt = this.createPromptFromProducts();
    this.service.sendMessage(this.userInput, prompt).subscribe(
      (res) => {
        this.response = res.choices[0].message.content;
        this.answers.push(this.response);
        this.questions.push(this.userInput);
        console.log('Pregunta: ', this.answers);
        console.log('Respuesta', this.questions);
        this.loading = false;
      },
      (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    );
  }

  public questionsList(event: Event): void {
    let target = event.target as HTMLElement; //Si no se le indica que es un elemento html no lo saca bien
    let paragraphText = target.getAttribute('data-info') ?? "";
    this.userInput = paragraphText;
    this.sendMessage();
  }

  // Input para introducir datos
  public updateUserInput(event: Event): void {
    let target = event.target as HTMLDivElement;
    this.userInput = target.innerText;
  }

  public ngOnInit() {
    // Texto dinámico
    const interval = setInterval(() => {
      if (this.currentIndex < this.arrayPlaceHolder.length) {
        this.placeHolderText += this.arrayPlaceHolder[this.currentIndex];
        this.currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    this.getProducts();
  }

  public createPromptFromProducts(): string {
    let promptbbdd = '';
    this.products.forEach(product => {
      promptbbdd += `
        Producto: ${product.name} (${product.brand})
        Precio Venta: ${product.price}
        Precio Compra: ${product.purchase_price}
        Stock: ${product.stock}
        Tipo: ${product.product_type}
        Fecha de Entrada: ${product.entry_date}
        Fecha de caducidad: ${product.expiration_date} 
        Expiración: ${product.expiration_date}
        Peso: ${product.weight}
        Dimensiones: ${product.dimensions}

        -----------------------------------
      `;
    });
    return promptbbdd;
  }

  public getProducts(): void {

    this.service.takeProducts(this.apiProductsUrl).subscribe({
      next: (response) => {
        this.products = response as ProductAllData[];
        console.log('Productos:', this.products);
      },
      error: (error) => {
        console.error('Error al seleccionar el producto:', error);
      }
    });
  }

}