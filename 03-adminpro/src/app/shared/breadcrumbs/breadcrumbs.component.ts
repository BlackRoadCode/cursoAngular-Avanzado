import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { pipe, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  public title:string;
  public tituloSubs$:Subscription;

  constructor( private _router:Router ) { 
    this.tituloSubs$ = this.getArgumentosRuta().subscribe( ({ title }) => {
      this.title = title;
      document.title = `AdminPro - ${ title }`;
    });
  }

  getArgumentosRuta(){
    return this._router.events.pipe(
      filter( event => event instanceof ActivationEnd ),
      filter( (event:ActivationEnd) => event.snapshot.firstChild === null ),
      map( (event:ActivationEnd) => event.snapshot.data )
    );
  }

  ngOnDestroy(){
    this.tituloSubs$.unsubscribe();
  }

}
