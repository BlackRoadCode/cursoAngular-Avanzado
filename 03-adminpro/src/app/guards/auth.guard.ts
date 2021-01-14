import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private _usuarioService:UsuarioService, private _router:Router ){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){

      return this._usuarioService.validarToken().pipe(
        tap( isAuth => {

          if( !isAuth ){
            this._router.navigateByUrl('/login');
          }

        } )
      );

  }
  
}
