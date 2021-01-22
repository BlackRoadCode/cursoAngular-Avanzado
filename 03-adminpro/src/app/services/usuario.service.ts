import { environment } from 'src/environments/environment';

import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';

import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService { 

  public auth2: any;
  public user: Usuario;

  constructor(private _httpClient: HttpClient, private _router: Router, private _ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE'{
    return this.user.role;
  }

  get uid(): string {
    return this.user.uid || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } }
  }

  googleInit() {

    return new Promise(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '1013426060438-stnd6p4bvd05dgvtik4en7tmt5p7s9rs.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve(this.auth2);

      });
    });

  }

  validarToken(): Observable<boolean> {
    return this._httpClient.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((res: any) => {
        // Desestructurando la información que viene del servicio
        const { nombre, email, img = '', google, role, uid } = res.user;
        // Asignando las propiedades a una nueva instancia de 'Usuario'
        this.user = new Usuario(nombre, email, '', img, google, role, uid);
        this.guardarStorage( res.token, res.menu );
        return true;
      }),
      catchError(err => of(false))
    );

  }

  crearUsuario(formData: RegisterForm) {
    return this._httpClient.post(`${base_url}/usuarios`, formData).pipe(tap((res: any) => {
      this.guardarStorage( res.token, res.menu );
    }));
  }

  actualizarUsuario(data: { email: string, nombre: string, role: string }) {

    data = { ...data, role: this.user.role };

    return this._httpClient.put(`${base_url}/usuarios/${this.uid}`, data, this.headers );

  }

  loginUsuario(formData: LoginForm) {
    return this._httpClient.post(`${base_url}/login`, formData).pipe(tap((res: any) => {
      this.guardarStorage( res.token, res.menu );
    }));
  }

  loginGoogle(token) {
    return this._httpClient.post(`${base_url}/login/google`, { token }).pipe(tap((res: any) => {

      this.guardarStorage( res.token, res.menu );
    }));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {

      this._ngZone.run(() => {
        this._router.navigateByUrl('/login');
      });
      // console.log('User signed out.');
    });
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this._httpClient.get<CargarUsuario>(url, this.headers).pipe(
      // delay( 1500 ),
      map(res => {

        const usuarios = res.usuarios.map( user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user.uid ) );

        return{
          total: res.total,
          usuarios
        }
      })
    )
  }

  eliminarUsuario(usuario:Usuario){
    const url = `${ base_url }/usuarios/${ usuario.uid }`;
    return this._httpClient.delete( url, this.headers );
  }

  guardarUsuario(usuario:Usuario) {
    return this._httpClient.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers );
  }

  guardarStorage( token:string, menu:any ){
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

}
