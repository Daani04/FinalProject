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
  userInput: string = '';
  response: string = '';

  constructor(public service: RequestService) { }

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
}
