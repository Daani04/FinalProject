import { Component} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgStyle } from '@angular/common';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgStyle],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(public service: RequestService) { }

  public notificationsList: { message: string, photo: string }[] = [];
  public ignoreNotifications: string[] = JSON.parse(localStorage.getItem('ignoreNotifications') || '[]');
  
  public hiddenNotification: boolean = false;

  public changeVisivility(): void {
    if (this.hiddenNotification === false) {
      this.hiddenNotification = true;
    } else {
      this.hiddenNotification = false;
    }
  }

  public changePhoto(index: number):void {
    this.notificationsList[index].photo = "pape2";
  }

  public resetPhoto(index: number): void {
    this.notificationsList[index].photo = "pape1";
  }
  public deleteNotification(index: number): void {
    if (index >= 0 && index < this.notificationsList.length) {
      console.log(this.notificationsList[index].message);
      this.ignoreNotifications.push(this.notificationsList[index].message);
      localStorage.setItem('ignoreNotifications', JSON.stringify(this.ignoreNotifications));
      this.notificationsList.splice(index, 1);
    }
  }

  //SIMULACRO DE LLAMADA A BASE DE DATOS 
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
      "Warranty_Period": "100 year",
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
    }
  ]

    //Llamada API deepseek

    generateNotification() {
      let prompt = this.createPromptFromProducts();
      let ignoreNotificationsString = this.ignoreNotifications.join(', ');
      console.log(this.ignoreNotifications);
      this.service.generateNotification(prompt, ignoreNotificationsString).subscribe(
        (res) => {
          let notificationContent = res.choices[0].message.content;
          let notifications = notificationContent.split('!');
          notifications.forEach((message: string) => {
            if (message.trim()) {  
              this.notificationsList.push({
                message: message.trim(),
                photo: "pape1" 
              });
            }
          });
        },
        (error) => {
          console.error('Error al generar notificación:', error);
        }
      );
    }
  

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

/*Comentado para no gastar saldo de la API
  ngOnInit() {
    this.generateNotification();  
    setInterval(() => {
      this.notificationsList = [];
      this.generateNotification();
    }, 300000)
  }
*/


}
