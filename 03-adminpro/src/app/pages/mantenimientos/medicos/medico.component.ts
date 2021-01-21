
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  public medicoForm:FormGroup;
  public hospitales:Hospital[] = [];
  public hospitalSeleccionado:Hospital;
  public medicoSeleccionado:Medico;

  constructor( private _formBuilder:FormBuilder, 
                private _hospitalService:HospitalService, 
                private _medicoService:MedicoService, 
                private _router:Router,
                private _activatedRoute:ActivatedRoute ) { }

  ngOnInit(): void {

    this._activatedRoute.params.subscribe( ({ id }) => {
      this.cargarMedico( id );
    });

    this.medicoForm = this._formBuilder.group({
      nombre:[ '', Validators.required ],
      hospital:[ '', Validators.required ]
    });

    this.cargarHospitales();

    // Creando un observable que esté pendiente de los cambios en el select de hospitales
    this.medicoForm.get('hospital').valueChanges.subscribe( hospitalId => { 
      this.hospitalSeleccionado = this.hospitales.find( hosp => hosp._id === hospitalId );
    });

  }

  cargarHospitales(){
    this._hospitalService.cargarHospitales()
    .subscribe( (hospitales:Hospital[]) => { 
      this.hospitales = hospitales;
     });
  }

  cargarMedico( id:string ){

    if ( id === 'nuevo' ){ return; }

    this._medicoService.cargarMedico( id ).pipe( delay(100) ).subscribe( medico => {
      const { nombre, hospital:{ _id } } = medico;

      this.medicoSeleccionado = medico;
      this.medicoForm.setValue({nombre, hospital:_id});
    }, error => {
      return this._router.navigateByUrl('/dashboard/medicos');
    });
  }

  guardarMedico(){

    const { nombre } = this.medicoForm.value;

    if( this.medicoSeleccionado ){
      // Actualizar al médico seleccionado
      const data = { ...this.medicoForm.value, _id:this.medicoSeleccionado._id };
      this._medicoService.actualizarMedico( data ).subscribe( resp => { 
        Swal.fire({
          title: 'Médico Actualizado',
          html: `El médico <strong> ${ nombre } </strong> fue actualizado con éxito.`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
       });
    } else {
      // Crear médico
      
      this._medicoService.crearMedico( this.medicoForm.value )
      .subscribe( (res:any) => {
        Swal.fire({
          title: 'Médico Creado',
          html: `El médico <strong> ${ nombre } </strong> fue creado con éxito.`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
  
        this._router.navigateByUrl(`/dashboard/medico/${ res.medico._id }`);
  
      });
    }

  }

}
