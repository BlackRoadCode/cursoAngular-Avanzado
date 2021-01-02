import { Component } from '@angular/core';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public data1:number[][] = [[17, 168, 63],[174, 84, 22]];
  public data2:number[][] = [[25, 6, 31]];
  public data3:number[][] = [[70, 2, 91]];

  public labels1:string[] = ['Playeras', 'Poleanas', 'Sitios web'];
  public labels2:string[] = ['Sueldos', 'Anuncios', 'Marketing'];
  public labels3:string[] = ['Insumos', 'Maquinaria', 'Local'];

  public colors1: Color[] =[{ backgroundColor:[ '#e3cc1e', '#cc6c0c', '#d4270d' ] }];
  public colors2: Color[] =[{ backgroundColor:[ '#f542aa', '#d90f23', '#4f0f15' ] }];
  public colors3: Color[] =[{ backgroundColor:[ '#0d414f', '#0768b8', '#1fc2c4' ] }];

} 
