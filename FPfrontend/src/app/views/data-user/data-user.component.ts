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
    
    isModalOpen = false;
    accountDeleted: boolean = false;

    openModal() {
      this.isModalOpen = true;
    }

    closeModal() {
      this.isModalOpen = false;
    }

    public closeSesion(): void{
      localStorage.clear();
      window.location.reload();
    }

    //HACER FUNCIONAL, DE MOMENTO SOLO VERIFICA SI SE HA CLICKADO EL BOTON
    confirmDelete() {
      this.accountDeleted = true;
      console.log('¿Se eliminó la cuenta?:', this.accountDeleted); // Aquí tienes el TRUE
      this.closeModal();
    }
  }
