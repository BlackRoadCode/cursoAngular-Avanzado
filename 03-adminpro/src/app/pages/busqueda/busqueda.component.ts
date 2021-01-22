import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  public usuarios:Usuario[] = [];
  public medicos:Medico[] = [];
  public hospitales:Hospital[] = [];

  constructor( private _activatedRoute:ActivatedRoute, private _busquedasService:BusquedasService ) { }

  ngOnInit(): void {

    this._activatedRoute.params.subscribe( ({ termino }) => this.busquedaGlobal( termino ));

  }

  busquedaGlobal( termino:string ){
    this._busquedasService.buscarByTerm( termino ).subscribe( (res:any) => {

      this.usuarios = res.usuarios;
      this.medicos = res.medicos;
      this.hospitales = res.hospitales;
    });
  }

  abrirMedico( medico:Medico ){
    console.log(medico);    
  }

}
