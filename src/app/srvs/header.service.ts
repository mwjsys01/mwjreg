import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';

export class Header {
  headid: number;
  type: string;
  name: string;
  status: string;
  created_at: Date; 
  code: string;
  usr: string;
  denno: number;
  constructor(init?:Partial<Header>) {
    Object.assign(this, init);
  }
}


@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  public header:Header=new Header();
  public headers:Header[]=[];
  public RDVAL: string="1";
  public chSHOP: boolean=true;
  public chCMPE: boolean;
  public placehold: string='データ読込中';
  public headid: number;

    //コンポーネント間通信用
  subject = new Subject<string>();
  observe = this.subject.asObservable();
  
  constructor() { 

  }
}
