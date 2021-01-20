import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  public imgSubs:Subscription;

  constructor( private _medicoService: MedicoService, private _busquedasService:BusquedasService, private _modalImagenService:ModalImagenService, private _router:Router ) { }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this._modalImagenService.imagenActualizada
    .pipe( delay(100) )
    .subscribe( res => this.cargarMedicos() );
  }

  ngOnDestroy():void{
    this.imgSubs.unsubscribe();
  }

  buscar(termino: string) {

    if( termino.length === 0 ){ 
      return this.medicos = this.medicosTemp; 
    }

    this._busquedasService.buscar( 'medicos',termino ).subscribe( res => { 
      this.medicos = res;
     })
  }

  cargarMedicos() {
    this.cargando = true;
    this._medicoService.cargarMedicos().subscribe(medicos => {
      this.cargando = false;
      this.medicos = medicos;
      this.medicosTemp = medicos;
    });
  }

  guardarMedico( medico:Medico ){
    // this._medicoService.actualizarHospital( medico._id, medico.nombre ).subscribe( res => {
    //   Swal.fire({
    //     title: 'Datos Actualizados',
    //     text: 'Los datos fueron actualizados con éxito.',
    //     icon: 'success',
    //     confirmButtonText: 'OK'
    //   });    
    // });
  }
  
  eliminarMedico( medico:Medico ){   
      Swal.fire({
        title: '¿Borrar médico?',
        html: `Está a punto de borrar al médico <b>${ medico.nombre }</b>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, quiero borrarlo.'
      }).then((result) => {
        if (result.value) {
          
          this._medicoService.borrarMedico( medico._id ).subscribe( res => {   
            Swal.fire(
              'Borrado!',
              'El registro ha sido borrado.',
              'success'
            )
            this.cargarMedicos();
          });
  
        }
      })
  }

  abrirModal(medico:Medico){
    this._modalImagenService.abrirModal( 'medicos', medico._id, medico.img );
  }

}
