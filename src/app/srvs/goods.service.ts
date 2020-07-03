import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export class Ginfo {
  gcode: string;
  gname: string;
  stock: number;
  price: number[];
  constructor(init?:Partial<Ginfo>) {
    Object.assign(this, init);
  }
}

export class Goods {
  categ: string;
  ginfo: Ginfo[];
  constructor(init?:Partial<Goods>) {
    Object.assign(this, init);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoodsService {
  public goods: Goods[]=[];
    //コンポーネント間通信用
  public subject = new Subject<string>();
  public observe = this.subject.asObservable();

  constructor() { }

  resetGoods() : void { this.goods=[]; }
  getGoods(){ return this.goods; }
  addGoods(pgoods:Goods) : void {
　　let i:number = this.goods.findIndex(obj => obj.categ == pgoods.categ);
    if ( i > -1 ){
　　　　this.goods[i].ginfo.push(pgoods.ginfo[0]);　　　
    }else{
　　　　this.goods.push(pgoods);
    }
  }
  decreGoods(ctg:string,j:number,dec:number) : void {
　　let i:number = this.goods.findIndex(obj => obj.categ == ctg);
　　this.goods[i].ginfo[j].stock +=dec;
  }
  getGinfo(ctg:string,j:number):Ginfo{
    let i:number = this.goods.findIndex(obj => obj.categ == ctg);
    console.log("gdssrv",ctg + "_" + i);
    return this.goods[i].ginfo[j];
  }
}



