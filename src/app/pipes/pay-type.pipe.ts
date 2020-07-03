import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'payType'
})
export class PayTypePipe implements PipeTransform {

  transform(value: string): string {
    let name: string;
    switch (value) {
      case "1":
      name = '掛';
      break;
      case "2":
        name = '現金';
      break;
      case "7":
        name = 'カード';
      break;
    }
    return name;
  }
}
