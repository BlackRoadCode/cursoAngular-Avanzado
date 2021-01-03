import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu:any[] =[
    {
      title:'Dashboard',
      icon:'mdi mdi-gauge',
      submenu: [
        { title:'Main', url: '/' },
        { title:'Progressbar', url: 'progress' },
        { title:'Gráfico', url: 'chart' },
        { title:'Promesas', url: 'promises' },
        { title:'RxJS', url: 'rxjs' },
      ]
    }
  ];

  constructor() { }
}
