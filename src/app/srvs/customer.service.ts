import { Injectable } from '@angular/core';

export class SelVal {
  value: string;
  viewValue: string;
  constructor(init?:Partial<SelVal>) {
    Object.assign(this, init);
  }
}
export class Cust {
  code: string;
  tkbn: number;
  zkbn: string;
  constructor(init?:Partial<Cust>) {
    Object.assign(this, init);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  public sval: SelVal[]=[];
  public cust: Cust[]=[];

  constructor() { }
  reset() {
    this.sval = new Array();
    this.cust = new Array();　
  }
  addSval(psval:SelVal) : void { this.sval.push(psval);}
  addCust(pcust:Cust) : void { this.cust.push(pcust);}
  getTkbn(pcode:string): number {
　　　let i:number = this.cust.findIndex(k => k.code==pcode)
　　　return this.cust[i].tkbn;
  }
  getZkbn(pcode:string): string {
　　　let i:number = this.cust.findIndex(k => k.code==pcode)
　　　return this.cust[i].zkbn;
  }
  getSval(){ return this.sval; }
　getCust(){ return this.cust; }

}
