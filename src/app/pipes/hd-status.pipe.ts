import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hdStatus'
})
export class HdStatusPipe implements PipeTransform {

  transform(value: string): string {
    let name: string;
    switch (value) {
      case "NEW":
        name = '登録';
      break;
      case "EDIT":
        name = '編集中';
      break;
      case "CMPL":
        name = 'CSV出力済';
      break;
    }
    return name;
  }

}
