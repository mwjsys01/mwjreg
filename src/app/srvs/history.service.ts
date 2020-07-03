import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { Cnthead, Count } from './counts.service';

export class Hist {
  checked: boolean;
  index: number;
  time: Date;
  head: Cnthead;
  deta: Count[];
  constructor(init?:Partial<Hist>) {
    Object.assign(this, init);
  }
}
export class Gdscnt {
  gdspr: string;
  count: number;
  constructor(init?:Partial<Gdscnt>) {
    Object.assign(this, init);
  }
}
export class Sum {
  custo: string;
  gprcs: Gdscnt[];
  constructor(init?:Partial<Sum>) {
    Object.assign(this, init);
  }  
}
export class Tblitems {
  prc: number;
  cnt: number;
  gds: string;
  idx: number;
  ctg: string;
  constructor(init?:Partial<Tblitems>) {
    Object.assign(this, init);
  }  
}


@Injectable({
  providedIn: 'root'
})

export class HistoryService {

  public hists:Hist[]=[];
  public sum:Sum[]=[];
  //コンポーネント間通信用
  subject = new Subject<string>();
  observe = this.subject.asObservable();

  constructor() {}

  reset_Hists(): void{
    this.hists=[];
    this.sum=[];
  }
  addHists(phist:Hist) : void { 
    this.hists.push(phist);
    this.calc_sum();
  }
  updHist(i :number,phist:Hist) {
    this.hists[i].head = phist.head;
    // this.hists[i].memos = phists.memos;
    // this.hists[i].custo = phists.custo;
    // this.hists[i].payty = phists.payty;　　
    // this.hists[i].prsum = phist.prsum;　
    // this.hists[i].detas = phists.detas;　
    this.calc_sum();
  }
  get_Hists(): Observable<Hist[]> {
    return of(this.hists);
  }
  getIndex():number {
    if (this.hists.length == 0)　{
      return 1;
    } else { 
      return this.hists[this.hists.length-1].index + 1;
    }
  }  
  private calc_sum(){
    let adSum:Sum;
    let adCnt:Gdscnt;
    let adCnts:Gdscnt[];
    let i:number
    let j:number
    let k:number
    let l:number

    this.sum=[];
    console.log("historyservice calc_sum",this.hists);
    for( i = 0; i < this.hists.length; i++) {

      j = this.sum.findIndex(o => o.custo==this.hists[i].head.cus +'_'+ this.hists[i].head.payt)
      if  (j == -1) {
        adCnts = new Array();
        for(k = 0; k < this.hists[i].deta.length; k++) {
          adCnt = {gdspr:this.hists[i].deta[k].gds + '_' + this.hists[i].deta[k].prc[0].toString(),
          count:this.hists[i].deta[k].cnt};
          adCnts.push(adCnt);
          adSum = {custo:this.hists[i].head.cus + this.hists[i].head.payt,
            gprcs:adCnts};
        }
        this.sum.push(adSum);
      } else {
        for(k = 0; k < this.hists[i].deta.length; k++) {
          l = this.sum[j].gprcs.findIndex(o => o.gdspr==this.hists[i].deta[k].gds +'_'+ this.hists[i].deta[k].prc[0])
          if  (l == -1) {
            adCnt = {gdspr:this.hists[i].deta[k].gds + '_' + this.hists[i].deta[k].prc[0].toString(),
            count:this.hists[i].deta[k].cnt};
            this.sum[j].gprcs.push(adCnt);
          } else {
            this.sum[j].gprcs[l].count += this.hists[i].deta[k].cnt;
          }
        }
      }
    }
  }   
}
