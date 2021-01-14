import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2:any;

  public loginForm = this._formBuilder.group({
    email: [ localStorage.getItem('email') || '', [ Validators.required, Validators.email ] ],
    password: [ '', [ Validators.required ] ],
    remember: [false]
  });

  constructor( private _router:Router, private _formBuilder:FormBuilder, private _usuarioService:UsuarioService, private _ngZone:NgZone ) { }

  ngOnInit(){
    this.renderButton();
  }

  login(){

    this._usuarioService.loginUsuario( this.loginForm.value ).subscribe( res => {

      if ( this.loginForm.get('remember').value ){
        localStorage.setItem( 'email', this.loginForm.get('email').value );
      } else {
        localStorage.removeItem('email');
      }

      this._router.navigateByUrl('/');

    }, (err) => {
      Swal.fire({
        title: 'Error', 
        text: err.error.msg, 
        icon: 'error',
        // html: '<p>No existe el correo? <a routerLink="/register" class="text-info m-l-5"><b>Regístrate gratis</b></a></p>',
        // footer: '<a href>Why do I have this issue?</a>'
      })     

    });

    // this._router.navigateByUrl('/');
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });

    this.startApp()

  }

  async startApp() {
    this.auth2 = await this._usuarioService.googleInit();
    this.attachSignin(document.getElementById('my-signin2'));
  };

  attachSignin( element ) {
    this.auth2.attachClickHandler( element, {},
        (googleUser) => {
          var id_token = googleUser.getAuthResponse().id_token;
          this._usuarioService.loginGoogle( id_token ).subscribe( res => {
            this._ngZone.run( () =>{
              this._router.navigateByUrl('/');
            } );
          });

        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
