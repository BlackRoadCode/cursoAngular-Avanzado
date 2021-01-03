import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promises',
  templateUrl: './promises.component.html',
  styleUrls: ['./promises.component.css']
})
export class PromisesComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {

    this.getUsuarios().then( usuarios => {
      console.log(usuarios);
    });
    // const promesa = new Promise( ( resolve, reject ) =>{

    //   if( false ){
    //     resolve('Envío esto desde el resolve');
    //   } else {
    //     reject('Algo salió mal');
    //   }

    // });

    // promesa.then( ( mensaje ) => {
    //   console.log('Finalizado hey terminé', mensaje);
    // })
    // .catch( error => { 
    //   console.log( 'Esto se ejecuta en el error cachado ', error );
    //  });

    // console.log('Fin del init');

  }

  getUsuarios() {

    return new Promise( resolve => {
      fetch('https://reqres.in/api/users')
        .then(resp => resp.json())
        .then(body => resolve(body['data']));
    });

  }
}
