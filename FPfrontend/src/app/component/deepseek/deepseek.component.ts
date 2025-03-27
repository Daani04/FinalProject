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
  public arrayPlaceHolder: string[] = ['¿', 'E', 'n', ' ', 'q', 'u', 'e', ' ', 'p', 'u', 'e', 'd', 'o', ' ', 'a', 'y', 'u', 'd', 'a', 't', 'e', '?'];
  private currentIndex: number = 0;

  public answers: string[] = []; 
  public questions: string[] = []; 

  public loading: boolean = false;

  sendMessage() {
    this.loading = true;
    let editableDiv = document.querySelector('.editable') as HTMLDivElement; //Selecciona el contenido del input
    editableDiv.innerText = ''; // Esto vacía el contenido del div editable
    this.service.sendMessage(this.userInput).subscribe(
      (res) => {
        this.response = res.choices[0].message.content;
        this.answers.push(this.response); 
        this.questions.push(this.userInput);
        console.log(this.answers);
        console.log(this.questions);
        this.loading = false;  
      },
      (error) => {
        console.error('Error:', error);
        this.loading = false;  
      }
    );
  }

  // Input para introducir datos
  updateUserInput(event: Event): void {
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
}