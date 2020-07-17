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
export class Tblitems {
  prc: number;
  cnt: number;
  gds: string;
  idx: number;
  cid: number;
  constructor(init?:Partial<Tblitems>) {
    Object.assign(this, init);
  }  
}
export class Total {
  rowsp: number;
  custo: string;
  payty: string;
  total : number;
  gcode: string;
  price: number;
  count: number;
  constructor(init?:Partial<Total>) {
    Object.assign(this, init);
  }  
}
// export class Gdscnt {
//   gcode: string;
//   price: number;
//   count: number;
//   constructor(init?:Partial<Gdscnt>) {
//     Object.assign(this, init);
//   }
// }
// export class Total {
//   custo: string;
//   payty: string;
//   total : number;
//   gprcs: Gdscnt[];
//   constructor(init?:Partial<Total>) {
//     Object.assign(this, init);
//   }  
// }

@Injectable({
  providedIn: 'root'
})

export class HistoryService {

  public hists:Hist[]=[];
  // public sum:Sum[]=[];
  public total:Total[]=[];
  //コンポーネント間通信用
  subject = new Subject<string>();
  observe = this.subject.asObservable();

  constructor() {}

  reset_Hists(): void{
    this.hists=[];
    this.total=[];
  } 
  addHists(phist:Hist) : void { 
    this.hists.push(phist);
    // this.calc_total();
  }
  getIndex():number {
    if (this.hists.length == 0)　{
      return 1;
    } else { 
      return this.hists[this.hists.length-1].index + 1;
    }
  }  
  public calc_total(){
    this.total=[];
    let lctots:Total[]=[];
    // let adCnt:Gdscnt;
    // let adCnts:Gdscnt[];    
    // let adSum:Sum;
    // let i:number
    // let j:number
    // let k:number
    // let l:number

    // this.sum=[];
    // console.log("historyservice calc_total",this.hists);
    for(let i=0; i<this.hists.length; i++) {
      let l:number = lctots.findIndex(o => o.custo==this.hists[i].head.cus && 
                                           o.payty==this.hists[i].head.payt)      
      if(l == -1) {
        const lctot:Total = { rowsp:0,
                              custo:this.hists[i].head.cus,
                              payty:this.hists[i].head.payt,
                              total:this.hists[i].head.sum,
                              gcode:"",
                              price:0,
                              count:0}
        lctots.push(lctot);
      } else {
        lctots[l].total += this.hists[i].head.sum;
      } 
      for(let j = 0; j < this.hists[i].deta.length; j++) {
        let k:number = this.total.findIndex(o => o.custo==this.hists[i].head.cus && 
                                                 o.payty==this.hists[i].head.payt && 
                                                 o.gcode==this.hists[i].deta[j].gds && 
                                                 o.price==this.hists[i].deta[j].prc[0])      
        if(k == -1) {
          const adTotal:Total = {rowsp:0,
                                 custo:this.hists[i].head.cus,
                                 payty:this.hists[i].head.payt,
                                 total:0,
                                 gcode:this.hists[i].deta[j].gds,
                                 price:this.hists[i].deta[j].prc[0],
                                 count:this.hists[i].deta[j].cnt};        
          this.total.push(adTotal);
          let l:number = lctots.findIndex(o => o.custo==this.hists[i].head.cus && 
                                               o.payty==this.hists[i].head.payt)
          lctots[l].rowsp += 1;                                
        } else {
          this.total[k].count += this.hists[i].deta[j].cnt;
        }
      }

    }
    this.total.sort((a,b)=>{
      if(a.custo<b.custo) return -1;
      if(a.custo>b.custo) return 1;
      if(a.payty<b.payty) return -1;
      if(a.payty>b.payty) return 1;
      if(a.gcode<b.gcode) return -1;
      if(a.gcode>b.gcode) return 1;
      if(a.price<b.price) return -1;
      if(a.price>b.price) return 1;
      return 0;
    });
    for(let i = 0; i < this.total.length; i++) {
      let l:number = lctots.findIndex(o => o.custo==this.total[i].custo && 
                                           o.payty==this.total[i].payty )    
      this.total[i].rowsp = lctots[l].rowsp;
      lctots[l].rowsp = 0;  
      this.total[i].total = lctots[l].total;
    }
    // for(let i = 0; i < this.hists.length; i++) {
    //   let j = this.total.findIndex(o => o.custo==this.hists[i].head.cus
    //                                  && o.payty==this.hists[i].head.payt)
    //   if  (j == -1) {
    //     let adCnts:Gdscnt[] = [];
    //     let lctotal:number=0;
    //     for(let k = 0; k < this.hists[i].deta.length; k++) {
    //       const adCnt:Gdscnt = { gcode:this.hists[i].deta[k].gds,
    //                              price:this.hists[i].deta[k].prc[0],
    //                              count:this.hists[i].deta[k].cnt };
    //       adCnts.push(adCnt);
    //       lctotal += this.hists[i].head.sum;
    //     }
    //     const adTot:Total = { custo:this.hists[i].head.cus,
    //                           payty:this.hists[i].head.payt,
    //                           total:lctotal,
    //                           gprcs:adCnts};
    //     this.total.push(adTot);
    //   } else {
    //     for(let k = 0; k < this.hists[i].deta.length; k++) {
    //       let l = this.total[j].gprcs.findIndex(o => o.gcode==this.hists[i].deta[k].gds
    //                                               && o.price==this.hists[i].deta[k].prc[0])
    //       if (l == -1) {
    //         const adCnt:Gdscnt  = { gcode:this.hists[i].deta[k].gds,
    //                                 price:this.hists[i].deta[k].prc[0],
    //                                 count:this.hists[i].deta[k].cnt };
    //         this.total[j].gprcs.push(adCnt);
    //       } else {
    //         this.total[j].gprcs[l].count += this.hists[i].deta[k].cnt;
    //       }
    //     }
    //     this.total[j].total += this.hists[i].head.sum;
    //   }
    // }  
    // console.log("hissrv calc_sum",this.sum);
  }   
}
