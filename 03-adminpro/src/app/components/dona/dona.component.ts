import { Component, Input } from '@angular/core';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: []
})
export class DonaComponent {

  @Input() title:string = "No title";
  @Input() data:number[][] = [[50, 100, 200]];
  @Input() colors: Color[] =[{ backgroundColor:[ '#6857E6', '#009FEE', '#F02059' ] }];
  @Input() labels: Label[] = ['Carros', 'Casas', 'Muebles'];

  // public doughnutChartLabels: Label[] = ['Carros', 'Casas', 'Muebles'];
  // public doughnutChartData: MultiDataSet = [
  //   [50, 100, 200]
  // ];
  // public doughnutChartData: MultiDataSet = this.data;

  // public colors: Color[] = [
  //   { backgroundColor:[ '#6857E6', '#009FEE', '#F02059' ] }
  // ];

}
