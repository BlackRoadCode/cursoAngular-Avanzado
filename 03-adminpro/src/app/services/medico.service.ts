import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor( private _httpClient:HttpClient ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } }
  }

  cargarMedicos() {
    const url = `${ base_url }/medicos`;
    return this._httpClient.get( url, this.headers ).pipe(
      map( (res:{ ok:boolean, medicos:Medico[] }) => res.medicos )
    );
  }

  cargarMedico( id:string ){
    const url = `${ base_url }/medicos/${ id }`;
    return this._httpClient.get( url, this.headers ).pipe(
      map( (res:{ ok:boolean, medico:Medico }) => res.medico )
    );
  }

  crearMedico( medico:{ nombre:string, hospital:string } ) {
    const url = `${base_url}/medicos`;
    return this._httpClient.post(url, medico , this.headers);
  }
  
  actualizarMedico( medico:Medico ) {
    const url = `${ base_url }/medicos/${ medico._id }`;
    return this._httpClient.put(url, medico , this.headers);
  }
  
  borrarMedico( id:string ) {
    const url = `${ base_url }/medicos/${ id }`;
    return this._httpClient.delete(url, this.headers);
  }

}
