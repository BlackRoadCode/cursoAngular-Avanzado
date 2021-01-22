import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu = [];

  cargarMenu(){
    this.menu = JSON.parse(localStorage.getItem('menu')) || [];
  }

  // menu:any[] =[
  //   {
  //     title:'Dashboard',
  //     icon:'mdi mdi-gauge',
  //     submenu: [
  //       { title:'Main', url: '/' },
  //       { title:'Progressbar', url: 'progress' },
  //       { title:'Gráfico', url: 'chart' },
  //       { title:'Promesas', url: 'promises' },
  //       { title:'RxJS', url: 'rxjs' },
  //     ]
  //   },
  //   {
  //     title:'Mantenimientos',
  //     icon:'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { title:'Usuarios', url: 'usuarios' },
  //       { title:'Hospitales', url: 'hospitales' },
  //       { title:'Médicos', url: 'medicos' },
  //     ]
  //   }
  // ];

}
