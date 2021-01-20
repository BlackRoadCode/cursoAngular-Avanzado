import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public imgSubs:Subscription;

  constructor(private _usuarioService: UsuarioService, private _busquedasService: BusquedasService, public modalImagenService:ModalImagenService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.imagenActualizada
    .pipe( delay(100) )
    .subscribe( res => this.cargarUsuarios() );
  }

  ngOnDestroy():void{
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde).subscribe(({ total, usuarios }) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string) {

    if( termino.length === 0 ){ 
      return this.usuarios = this.usuariosTemp; 
    }

    this._busquedasService.buscar( 'usuarios',termino ).subscribe( (res:Usuario[]) => { 
      this.usuarios = res;
     })
  }

  eliminarUsuario( usuario:Usuario ){

    if( usuario.uid === this._usuarioService.uid ){
      return Swal.fire(
        'Error de capa 8',
        'Usted pretende crear una paradoja usuario/facultades... No lo haga.',
        'error'
      );
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      html: `Está a punto de borrar al usuario <b>${ usuario.nombre }</b>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero borrarlo.'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this._usuarioService.eliminarUsuario( usuario ).subscribe( res => {   
          Swal.fire(
            'Borrado!',
            'El usuario ha sido borrado.',
            'success'
          )

          this.cargarUsuarios();
        });

      }
    })

  }

  cambiarRole(usuario:Usuario){

    this._usuarioService.guardarUsuario( usuario ).subscribe( res => {
      Swal.fire(
        'Actualizado!',
        'El usuario ha sido actualizado.',
        'success'
      )
    });

  }

  abrirModal(usuario:Usuario){
    // console.log( usuario );    
    this.modalImagenService.abrirModal( 'usuarios', usuario.uid, usuario.img );
  }

}
