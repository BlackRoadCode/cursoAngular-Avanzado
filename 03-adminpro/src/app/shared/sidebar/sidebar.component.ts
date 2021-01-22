import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  public user:Usuario;

  constructor( public sidebarService:SidebarService, private _usuarioService:UsuarioService ) {
    this.user = _usuarioService.user;
   }

  ngOnInit(): void { }

}
