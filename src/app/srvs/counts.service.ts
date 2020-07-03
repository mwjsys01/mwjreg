import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export class Count {
  ctg: string;
  gds: string;
  gnm: string;
  prc: number[];
  cnt: number;
  idx: number;
  constructor(init?:Partial<Count>) {
    Object.assign(this, init);
  }
}
export class Cnthead {
  sum: number;
  zei: number;
  azu: number;
  rat: number;
  tkbn:number;
  zkbn:string;
  neb: number;
  mem: string;
  cus: string;
  payt:string;
  constructor() {
    this.sum = 0;
    this.zei = 0;
    this.azu = 10000;
    this.rat = 10;
    this.tkbn = 1;
    this.zkbn = "1";
    this.neb = 0;
    this.mem="";
    this.cus="119908";
    this.payt="2";
  }
}

@Injectable({
  providedIn: 'root'
})
export class CountsService {
  public cnthead:Cnthead =new Cnthead();
  public items: Count[]=[];
  //コンポーネント間通信用
  public subject = new Subject<string>();
  public observe = this.subject.asObservable();

  constructor() { }

  getList() :any { return this.items; }
  setKbn(tkbn:number,zkbn:string) :void {
    this.cnthead.tkbn = tkbn;
    this.cnthead.zkbn = zkbn;
    for(let i = 0; i < this.items.length; i++) {
      this.items[i].prc[0] = this.items[i].prc[this.cnthead.tkbn];
    }
    this.calc_sum();
  }
  clear() {
    this.items = new Array();
    this.cnthead = new Cnthead();
  }
  addList(Ctg :string, Gds :string, Gnm :string, Prc :number[], Idx:number) :void {
    let i:number = this.items.findIndex(k => k.gds==Gds)
    // console.log("addlist" + i,this.cnthead);
    // console.log("addlist" + Gds,Prc);
    if  (i == -1) {
      Prc[0] = Prc[this.cnthead.tkbn];
      let adGds:Count = {ctg:Ctg,gds:Gds,gnm:Gnm,prc:Prc,cnt:1,idx:Idx};
      this.items.push(adGds);
    } else {
      this.items[i].cnt += 1;
    }
    this.calc_sum()
  }
  setList(Ctg:string,Idx:number,Gds:string,Prc:number[],Cnt:number,Gnm:string) :void {
    let adGds:Count = {ctg:Ctg,gds:Gds,gnm:Gnm,prc:Prc,cnt:Cnt,idx:Idx};
    this.items.push(adGds);
  }  
  delList(Gds :string) :void {
    let i:number = this.items.findIndex(k => k.gds==Gds)
    this.items.splice(i,1);
    this.calc_sum();
  }
  disCount(r :number,t :number) :void {
    for(let i = 0; i < this.items.length; i++) {
      this.items[i].prc[0] = this.items[i].prc[t] - Math.floor(this.items[i].prc[t] * r / 100);
    }
    this.calc_sum();
  }
  calc_sum() :void {
    this.cnthead.sum=0;
    this.cnthead.zei=0;
    for(let i = 0; i < this.items.length; i++) {
      this.cnthead.sum += this.items[i].prc[0] * this.items[i].cnt;
    }
    if(this.cnthead.zkbn = "0"){
      this.cnthead.zei = Math.floor(this.cnthead.sum * this.cnthead.rat / 100);
      this.cnthead.sum = this.cnthead.sum + this.cnthead.zei;
    }else{
      this.cnthead.zei = Math.floor(this.cnthead.sum * this.cnthead.rat / (100 + this.cnthead.rat));
    }
    this.cnthead.azu =  Math.ceil(this.cnthead.sum / 10000 ) * 10000;
  }

}
