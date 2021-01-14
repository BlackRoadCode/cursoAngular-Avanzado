import { catchError, map, tap } from 'rxjs/operators';
import { Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';

const base_url = environment.base_url;
declare const gapi:any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2:any;

  constructor( private _httpClient:HttpClient, private _router:Router, private _ngZone:NgZone ) {

    this.googleInit();

  }

  googleInit(){

    return new Promise( resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '1013426060438-stnd6p4bvd05dgvtik4en7tmt5p7s9rs.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        
        resolve(this.auth2);
        
      });
    });

  }

  validarToken():Observable<boolean>{
    const token = localStorage.getItem('token') || '';

    return this._httpClient.get(`${base_url}/login/renew`, {
      headers: {
        'x-token':token
      }
    }).pipe(
      tap( (res:any) => {
        localStorage.setItem('token', res.token );
      }), 
      map( res => true ),
      catchError( err => of(false) )
    );

  }

  crearUsuario( formData:RegisterForm ){
    return this._httpClient.post( `${base_url}/usuarios`, formData ).pipe( tap( (res:any) => {
      localStorage.setItem('token', res.token );
     } ) );
  }
  
  loginUsuario( formData:LoginForm ){
    return this._httpClient.post( `${base_url}/login`, formData ).pipe( tap( (res:any) => {
     localStorage.setItem('token', res.token );
    } ) );
  }
  
  loginGoogle( token ){
    return this._httpClient.post( `${base_url}/login/google`, { token } ).pipe( tap( (res:any) => {
     localStorage.setItem('token', res.token );
    } ) );
  }

  logout(){
    localStorage.removeItem('token');
    
    this.auth2.signOut().then( () => {

      this._ngZone.run( () =>{
        this._router.navigateByUrl('/login');
      } );
      // console.log('User signed out.');
    });
  }

}
