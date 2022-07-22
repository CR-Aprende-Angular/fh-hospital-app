import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Hospital } from '../../../models/hospital.model';

import { BusquedasService } from '../../../services/busquedas.service';
import { ContactService } from '../../../services/contact.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Contact } from '../../../models/contact.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styles: [
  ]
})
export class ContactsComponent implements OnInit, OnDestroy {

  public contacts: Contact[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor( private contactService: ContactService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarContactos();

    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe( img => this.cargarContactos() );
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.cargarContactos();
    }

    this.busquedasService.buscar( 'contacts', termino )
        .subscribe( resp => {

          this.contacts = resp; // aca hay un problema con el atributo name, que es obligatorio

        });
  }

  cargarContactos() {

    this.cargando = true;
    this.contactService.getContacts()
        .subscribe( hospitales => {
          this.cargando = false;
          this.contacts = hospitales;
        })

  }

  guardarCambios( contact: Contact ) {

    this.contactService.updateContact( contact._id, contact.name )
        .subscribe( resp => {
          Swal.fire( 'Actualizado', contact.name, 'success' );
        });

  }

  deleteContact( contact: Contact ) {  console.log(contact);

    this.contactService.deleteContact( contact._id )
        .subscribe( resp => {
          this.cargarContactos();
          Swal.fire( 'Borrado', contact.name, 'success' );
        });

  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear contacto',
      text: 'Ingrese el nombre del nuevo contacto',
      input: 'text',
      inputPlaceholder: 'Nombre del contacto',
      showCancelButton: true,
    });
    
    if( value.trim().length > 0 ) {
      this.contactService.createContact( value )
        .subscribe( (resp: any) => {
          this.contacts.push( resp.contact )
        })
    }
  }

  abrirModal(hospital: Hospital) {

    this.modalImagenService.abrirModal( 'hospitales', hospital._id, hospital.img );

  }

}
 
