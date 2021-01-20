import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales:Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando:boolean = true;
  public imgSubs:Subscription;

  constructor( private _hospitalService:HospitalService, private modalImagenService:ModalImagenService, private _busquedasService:BusquedasService ) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.imagenActualizada
    .pipe( delay(100) )
    .subscribe( res => this.cargarHospitales() );
  }

  ngOnDestroy():void{
    this.imgSubs.unsubscribe();
  }

  buscar(termino: string) {

    if( termino.length === 0 ){ 
      return this.hospitales = this.hospitalesTemp; 
    }

    this._busquedasService.buscar( 'hospitales',termino ).subscribe( res => { 
      this.hospitales = res;
     })
  }

  cargarHospitales(){
    this.cargando = true;
    this._hospitalService.cargarHospitales().subscribe( hospitales => {
      this.cargando = false;
      this.hospitales = hospitales;
      this.hospitalesTemp = hospitales;
    });
  }

  guardarHospital( hospital:Hospital ){
    this._hospitalService.actualizarHospital( hospital._id, hospital.nombre ).subscribe( res => {
      Swal.fire({
        title: 'Datos Actualizados',
        text: 'Los datos fueron actualizados con éxito.',
        icon: 'success',
        confirmButtonText: 'OK'
      });    
    });
  }
  
  eliminarHospital( hospital:Hospital ){
    this._hospitalService.borrarHospital( hospital._id ).subscribe( res => {
      Swal.fire({
        title: 'Hospital eliminado',
        text: 'El hospital fue eliminado con éxito.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      this.cargarHospitales();

    });
  }

  async abrirModalSA(){
    const { value = '' } = await Swal.fire<string>({
      input: 'text',
      title:"Crear Hospital",
      inputLabel: 'Ingrese el nombre del nuevo hospital',
      inputPlaceholder: 'P.ej. Hospital de la luz',
      showCancelButton:true
    })

    if (value.trim().length > 0){
      
      this._hospitalService.crearHospital( value ).subscribe( (res:any) => {
        Swal.fire({
          title: 'Creación exitosa',
          html: `El registro <b>${ value }</b> fue creado con éxito`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
  
        this.hospitales.push( res.hospital );
      });
    }
  }

  abrirModal(hospital:Hospital){
    this.modalImagenService.abrirModal( 'hospitales', hospital._id, hospital.img );
  }

}
