import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public user: Usuario;
  
  constructor( private _usuarioService:UsuarioService ) {
    this.user = _usuarioService.user;
  }



  logout(){
    this._usuarioService.logout();
  }

}
