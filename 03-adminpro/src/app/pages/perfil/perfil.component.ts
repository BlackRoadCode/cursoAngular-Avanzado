import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public perfilForm:FormGroup;
  public usuario:Usuario;
  public imagenSubir:File;
  public imgTemp:any = '';

  constructor( private _formBuilder:FormBuilder, private _usuarioService:UsuarioService, private _fileUploadService:FileUploadService ) {
    this.usuario = _usuarioService.user;
  }

  ngOnInit(): void {

    this.perfilForm = this._formBuilder.group({
      nombre:[this.usuario.nombre, Validators.required],
      email:[this.usuario.email, [Validators.required, Validators.email]],
    });

  }

  actualizarPerfil(){
    this._usuarioService.actualizarUsuario( this.perfilForm.value )
    .subscribe( () =>{
      const { nombre, email } = this.perfilForm.value;
      this.usuario.nombre = nombre;
      this.usuario.email = email;

      Swal.fire({
        title: 'Datos Actualizados',
        text: 'Tus datos fueron actualizados con éxito.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

     }, (err) => {

      Swal.fire({
        title: 'Error al actualizar',
        text: err.error.msg,
        icon: 'error',
        confirmButtonText: 'OK'
      });
     });
  }

  cambiarImagen( file:File ){
    this.imagenSubir = file;

    if( !file ){ 
      return this.imgTemp = null; 
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () =>{
      this.imgTemp = reader.result;
    }

  }

  subirImagen(){
    this._fileUploadService.actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid ).then( img => {
      this.usuario.img = img;
      // this._usuarioService.validarToken();

      Swal.fire({
        title: 'Avatar actualizado',
        text: 'La imagen de usuario fue actualizada con éxito.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }).catch( err => {
      Swal.fire({
        title: 'Error al actualizar',
        text: err.error.msg,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }

}
