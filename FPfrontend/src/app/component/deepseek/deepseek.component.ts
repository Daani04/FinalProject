import { Component } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { FormsModule } from '@angular/forms';

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
  public arrayPlaceHolder: string[] = ['¿', 'E', 'n',' ', 'q', 'u', 'e',' ', 'p', 'u', 'e', 'd', 'o',' ', 'a', 'y', 'u', 'd', 'a', 't', 'e', '?'];
  private currentIndex: number = 0;



  sendMessage() {
    this.service.sendMessage(this.userInput).subscribe(
      (res) => {
        this.response = res.choices[0].message.content;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  //Permite que el contenedor crezca dinamicamente con el texto
  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';  // Restablece la altura para poder ajustarse
    textarea.style.height = `${textarea.scrollHeight}px`;  // Ajusta la altura según el contenido
  }

  public ngOnInit() {
    // Texto dinamico
    const interval = setInterval(() => {
      if (this.currentIndex < this.arrayPlaceHolder.length) {
        this.placeHolderText += this.arrayPlaceHolder[this.currentIndex]; 
        this.currentIndex++; 
      } else {
        clearInterval(interval); 
      }
    }, 100); 
  }

}
