import { Component } from '@angular/core';
import { FooterComponent } from "../../component/footer/footer.component";

@Component({
  selector: 'app-warehouse',
  imports: [FooterComponent],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.css'
})
export class WarehouseComponent {

  public formWarehouse: boolean = false;

  public controlForm(): void {
    if (this.formWarehouse === false) {
      this.formWarehouse = true;
    } else {
      this.formWarehouse = false;
    }
  }

}
