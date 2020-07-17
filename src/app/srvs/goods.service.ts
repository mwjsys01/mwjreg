import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Apollo } from 'apollo-angular';
import * as Query from '../graph-ql/queries';
import { Count } from './counts.service';

export class Ginfo {
  index: number;
  gcode: string;
  gname: string;
  stock: number;
  price: number[];
  constructor(init?:Partial<Ginfo>) {
    Object.assign(this, init);
  }
}

export class Goods {
  catid: number;
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

  constructor(private apollo: Apollo) { }

  resetGoods() : void { this.goods=[]; }
  getGoods(){ return this.goods; }
  addGoods(pgoods:Goods) : void {
　　let i:number = this.goods.findIndex(obj => obj.catid == pgoods.catid);
    if ( i > -1 ){
　　　　this.goods[i].ginfo.push(pgoods.ginfo[0]);　　　
    }else{
　　　　this.goods.push(pgoods);
    }
  }
  decreGoods(cid:number,idx:number,dec:number) : void {
    let i:number = this.goods.findIndex(obj => obj.catid == cid);
    let j:number = this.goods[i].ginfo.findIndex(obj => obj.index == idx);
　　this.goods[i].ginfo[j].stock +=dec;
  }
  getGinfo(cid:number,idx:number):Ginfo{
    let i:number = this.goods.findIndex(obj => obj.catid == cid);
    let j:number = this.goods[i].ginfo.findIndex(obj => obj.index == idx);
    console.log("gdssrv",cid + "_" + i);
    return this.goods[i].ginfo[j];
  }
  update_stock(headid:number,idxs:Count[]):void  { 
    // console.log("updstock",this.goods);

    for (let i=0;i<idxs.length;++i){
      let j:number = this.goods.findIndex(obj => obj.catid == idxs[i].cid);
      let k:number = this.goods[j].ginfo.findIndex(obj => obj.index == idxs[i].idx);    
      
      this.apollo.mutate<any>({
        mutation: Query.UpdateStock,
        variables: {
          headid: headid,
          index : idxs[i].idx,
          stock : this.goods[j].ginfo[k].stock
        },
      }).subscribe(({ data }) => {
        // console.log('updatestock', data);
      },(error) => {
        console.log('error UpdateStock', error);
      });
    }
  } 





}



