import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( private _httpClient:HttpClient ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } }
  }

  cargarHospitales() {
    const url = `${base_url}/hospitales`;
    return this._httpClient.get(url, this.headers).pipe(
      map( (res:{ ok:boolean, hospitales:Hospital[] }) => res.hospitales )
    );
  }
  
  crearHospital(nombre:string) {
    const url = `${base_url}/hospitales`;
    return this._httpClient.post(url, { nombre } , this.headers);
  }
  
  actualizarHospital(_id:string, nombre:string) {
    const url = `${ base_url }/hospitales/${ _id }`;
    return this._httpClient.put(url, { nombre } , this.headers);
  }
  
  borrarHospital(_id:string) {
    const url = `${base_url}/hospitales/${ _id }`;
    return this._httpClient.delete(url, this.headers);
  }

}
