import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.css']
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs:Subscription;

  constructor() {
    
    

    // this.retornaObservable().pipe(
    //   retry(1)
    // ).subscribe( 
    //   valor => console.log( 'subs: ', valor ),
    //   err  => console.warn('Sucedió un error', err),
    //   () => console.log('Finalizó el observable.')
    //  );

    this.intervalSubs = this.returnInterval().subscribe( console.log );

   }

   ngOnDestroy(){
     this.intervalSubs.unsubscribe();
   }

   returnInterval():Observable<number>{

    return interval( 500 ).pipe(
      // take(10),
      map( valor => valor + 1 ),
      filter( valor => ( valor % 2 === 0 ) ? true:false )
    );

   }

   retornaObservable():Observable<number>{
    let i = 0;
    
    return new Observable<number>( observer =>{

      const interval = setInterval( () =>{ 
        
        i++;

        observer.next(i);

        if( i === 4 ){
          clearInterval( interval );
          observer.complete();
        }

        if( i === 2 ){
          observer.error('Problemas');
        }

       }, 1000 );
    });

   }

}
