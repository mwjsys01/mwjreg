import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentInput'
})
export class PercentInputPipe implements PipeTransform {

  transform(value: any): string {
    let cent:number = +value
    return value.toString() + '%' ;
  }

  parse(value: string): string {
    return value.replace(/%/gi,'');
  }

}
