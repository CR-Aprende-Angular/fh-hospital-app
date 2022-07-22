import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Contact } from '../models/contact.model';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class ContactService {


  constructor( private http: HttpClient ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }


  getContacts() {

    const url = `${ base_url }/contacts`;
    return this.http.get( url, this.headers )
              .pipe( 
                map( (resp: {ok: boolean, contacts: Contact[] }) => resp.contacts )
              );
  }

  createContact( name: string ) {

    const url = `${ base_url }/contacts`;
    return this.http.post( url, { name }, this.headers );
  }
  
  updateContact( _id: string, name: string  ) {

    const url = `${ base_url }/contacts/${ _id }`;
    return this.http.put( url, { name }, this.headers );
  }

  deleteContact( _id: string ) {

    const url = `${ base_url }/contacts/${ _id }`;
    return this.http.delete( url, this.headers );
  }

}
