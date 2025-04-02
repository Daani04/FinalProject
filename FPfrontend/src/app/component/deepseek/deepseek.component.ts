import { Component } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { FormsModule } from '@angular/forms';
import { json } from 'express';

@Component({
  selector: 'app-deepseek',
  imports: [FormsModule],
  templateUrl: './deepseek.component.html',
  styleUrl: './deepseek.component.css',
  providers: [RequestService] // Para Standalone Components
})
export class DeepseekComponent {

  constructor(public service: RequestService) { }

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
    let paragraphText = target.innerText;
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
  }

  //SIMULACRO CONEXION A BASE DE DATOS 
  public products =  [
    {
      "ID": 1001,
      "Warehouse_ID": "WH-001",
      "Name": "Ultra HD Smart TV",
      "Brand": "Samsung",
      "Price": "$12,99",
      "Stock": 5,
      "Product_Type": "Electronics",
      "Expiration_Date": "N/A",
      "Warranty_Period": "2 years",
      "Weight": "15.2 kg",
      "Dimensions": "48\" x 28\" x 4\"",
      "Entry_Date": "2023-05-15",
      "Product_Photo": "Smart TV"
    },
    {
      "ID": 1002,
      "Warehouse_ID": "WH-002",
      "Name": "Wireless Earbuds",
      "Brand": "Apple",
      "Price": "$199.99",
      "Stock": 120,
      "Product_Type": "Electronics",
      "Expiration_Date": "N/A",
      "Warranty_Period": "1 year",
      "Weight": "0.05 kg",
      "Dimensions": "2.5\" x 2\" x 1\"",
      "Entry_Date": "2023-06-01",
      "Product_Photo": "Wireless Earbuds"
    },
    {
      "ID": 1003,
      "Warehouse_ID": "WH-003",
      "Name": "Gaming Laptop",
      "Brand": "Delll",
      "Price": "$1,499.99",
      "Stock": 25,
      "Product_Type": "Electronics",
      "Expiration_Date": "N/A",
      "Warranty_Period": "2 years",
      "Weight": "2.5 kg",
      "Dimensions": "15.6\" x 10\" x 0.7\"",
      "Entry_Date": "2023-07-12",
      "Product_Photo": "Gaming Laptop"
    },
    {
      "ID": 1004,
      "Warehouse_ID": "WH-004",
      "Name": "Air Fryer",
      "Brand": "Philips",
      "Price": "$129.99",
      "Stock": 60,
      "Product_Type": "Home Appliances",
      "Expiration_Date": "N/A",
      "Warranty_Period": "1 year",
      "Weight": "4.5 kg",
      "Dimensions": "12\" x 12\" x 14\"",
      "Entry_Date": "2023-08-03",
      "Product_Photo": "Air Fryer"
    },
    {
      "ID": 1005,
      "Warehouse_ID": "WH-005",
      "Name": "4K Action Camera",
      "Brand": "GoPro",
      "Price": "$399.99",
      "Stock": 90,
      "Product_Type": "Electronics",
      "Expiration_Date": "N/A",
      "Warranty_Period": "2 years",
      "Weight": "0.4 kg",
      "Dimensions": "3.5\" x 2.5\" x 1.5\"",
      "Entry_Date": "2023-09-20",
      "Product_Photo": "Action Camera"
    },
    {
      "ID": 1005,
      "Warehouse_ID": "WH-005",
      "Name": "ak47",
      "Brand": "N/A",
      "Price": "$399.99",
      "Stock": 1,
      "Product_Type": "war",
      "Expiration_Date": "N/A",
      "Warranty_Period": "2 years",
      "Weight": "4 kg",
      "Dimensions": "N/a",
      "Entry_Date": "2023-09-20",
      "Product_Photo": "N/a"
    }
  ]

  public createPromptFromProducts(): string {
    let prompt = '';
    this.products.forEach(product => {
      prompt += `
        Producto: ${product.Name} (${product.Brand})
        Precio: ${product.Price}
        Stock: ${product.Stock}
        Tipo: ${product.Product_Type}
        Fecha de Entrada: ${product.Entry_Date}
        Garantía: ${product.Warranty_Period}
        Expiración: ${product.Expiration_Date}
        Peso: ${product.Weight}
        Dimensiones: ${product.Dimensions}

        -----------------------------------
      `;
    });
    return prompt;
  }

}