import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeiKbn'
})
export class ZeiKbnPipe implements PipeTransform {

  transform(value: string): string {
    let zKbn: string;
    switch (value) {
      case "0":
      zKbn = '外税';
      break;
      case "1":
      zKbn = '内税';
      break;
      case "2":
      zKbn = '非課税';
      break;
      case "3":
      zKbn = '商品マスタ依存';
      break;
    }
    return zKbn;
  }

}
