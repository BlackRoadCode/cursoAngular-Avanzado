import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private _httpClient:HttpClient ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } }
  }

  private transformarUsuarios( resultados:any[] ):Usuario[]{
    return resultados.map( user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user.uid ) );
  }
  
  private transformarHospitales( resultados:any[] ):Hospital[]{
    return resultados;
  }
  
  private transformarMedicos( resultados:any[] ):Medico[]{
    return resultados;
  }

  buscar( tipo:'usuarios' | 'medicos' | 'hospitales', termino:string ){
    
    const url = `${base_url}/todo/coleccion/${ tipo }/${ termino }`;

    return this._httpClient.get<any[]>(url, this.headers).pipe(
      map( ( res:any ) => {
        switch ( tipo ) {
          case 'usuarios':
            return this.transformarUsuarios( res.resultados );
          case 'medicos':
            return this.transformarHospitales( res.resultados );
          case 'hospitales':
            return this.transformarMedicos( res.resultados );
          default:
            return [];
        }
      })
    )
  }

  buscarByTerm( termino:string ){
    const url = `${base_url}/todo/${ termino }`;
    return this._httpClient.get( url, this.headers );
  }
}
