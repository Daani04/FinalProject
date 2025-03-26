import { Component } from '@angular/core';
import { FooterComponent } from "../../component/footer/footer.component";
import { ModalComponent } from "../../component/modal/modal.component";

@Component({
  selector: 'app-data-user',
  imports: [FooterComponent, ModalComponent],
  templateUrl: './data-user.component.html',
  styleUrl: './data-user.component.css'
})
export class DataUserComponent {

}
