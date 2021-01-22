import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this._formBuilder.group({
    nombre: ['', [ Validators.required, Validators.minLength(3) ] ],
    email: [ '', [ Validators.required, Validators.email ] ],
    password: [ '', [ Validators.required ] ],
    password2: [ '', [ Validators.required ] ],
    terminos: [ false, [ Validators.required ] ]
  }, {
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor( private _formBuilder:FormBuilder, private _usuarioService:UsuarioService, private _router:Router ) {  }

  crearUsuario(){
    this.formSubmitted = true;
    console.log( this.registerForm.value );

    if ( this.registerForm.invalid ) {
      return;
    }

    // Realizar posteo
    this._usuarioService.crearUsuario( this.registerForm.value ).subscribe( res => {
      // console.log('usuario creado');
      // console.log(res);
      this._router.navigateByUrl('/');      
    }, (err) => {
      // Si sucede un error
      Swal.fire({
        title: 'Error', 
        text: err.error.msg, 
        icon: 'error',
        // html: '<p>Already have an account? <a routerLink="/login" class="text-info m-l-5"><b>Sign In</b></a></p>',
        footer: '<a href>Why do I have this issue?</a>'
      });
    });

  }

  campoNoValido( campo:string ):boolean{

    if( this.registerForm.get(campo).invalid && this.formSubmitted ){
      return true;
    } else{
      return false;
    }

  }
  
  contrasenasNoValidas(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if( (pass1 !== pass2) && this.formSubmitted ){
      return true;
    } else {
      return false;
    }
  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

  passwordsIguales( pass1Name:string, pass2Name:string ){

    return ( formGroup:FormGroup ) => {

      const pass1Control = formGroup.get( pass1Name );
      const pass2Control = formGroup.get( pass2Name );

      if( pass1Control.value === pass2Control.value ){
        pass2Control.setErrors(null);
      } else{
        pass2Control.setErrors( {noEsIgual:true} );
      }

    }

  }


}
