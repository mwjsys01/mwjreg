import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { HeaderService } from '../srvs/header.service';
import { Goods, GoodsService } from '../srvs/goods.service';
import { Count, CountsService } from '../srvs/counts.service';
import { SelVal, Cust, CustomerService } from '../srvs/customer.service';
import { Hist, Tblitems, HistoryService } from '../srvs/history.service';
import { CounttblComponent } from '../tblcount/counttbl.component';
import { Apollo } from 'apollo-angular';
import * as Query from '../graph-ql/queries';

@Component({
  selector: 'app-tab02',
  templateUrl: './tab02.component.html',
  styleUrls: ['./tab02.component.scss']
})
export class Tab02Component implements OnInit,AfterViewInit {
  @ViewChild(CounttblComponent,{static: false})　public cntcomp:CounttblComponent;
  constructor(public headservice: HeaderService,
              public goodsservice: GoodsService,
              public cntservice: CountsService,
              public custservice: CustomerService,
              public histservice: HistoryService,
              private elementRef: ElementRef,
              private apollo: Apollo) { }

  ngOnInit():void {
    console.log("tab02oninit",this.elementRef.nativeElement.querySelector('mat-expansion-panel'));
  }
  ngAfterViewInit():void {
    console.log("tab02afterview",this.elementRef.nativeElement.querySelector('mat-expansion-panel'));
  }
  disCount(i :number):void {
    this.cntservice.disCount(i,this.cntservice.cnthead.tkbn);
    this.cntservice.subject.next();
  }
  setKbn(event):void {
    this.cntservice.cnthead.tkbn = this.custservice.getTkbn(event.value);
    this.cntservice.cnthead.zkbn = this.custservice.getZkbn(event.value);
    this.cntservice.setKbn(this.cntservice.cnthead.tkbn,this.cntservice.cnthead.zkbn);
    this.cntservice.subject.next();
  }
  addList(Gds :string, Gnm :string, Prc :number[], Cat :string, Idx :number):void {
    this.cntservice.addList(Cat,Gds,Gnm,Prc,Idx);
    this.goodsservice.decreGoods(Cat,Idx,-1);
    this.cntservice.subject.next();
    this.goodsservice.subject.next();
  }
  addHist():void {
    // 登録ボタン
    const hist:Hist = {
        checked:false,
        index:this.histservice.getIndex(),
        time:new Date(),
        head:this.cntservice.cnthead,
        deta:this.cntservice.items
      };
    // historyserviceへ追加
    this.histservice.addHists(hist);
    // tbldetails-tblitemsへ保存
    this.save_det(hist);
    // tblstockを更新
    this.update_stock();

    this.cntservice.clear();
    if (this.headservice.header.type == 'CMPE') {
      this.cntservice.cnthead.cus=this.headservice.header.code;
    }
    this.cntcomp.updateData();
  }
  calc():void {
    this.cntservice.calc_sum();
  }
  cancel():void {
    // キャンセルボタン
    console.log("tab02cancel",this.elementRef.nativeElement.querySelector('mat-expansion-panel'));
    const data:Count[]=this.cntservice.items;
    for (let i=0;i<data.length;++i){
      this.goodsservice.decreGoods(data[i].ctg,data[i].idx,data[i].cnt);
    }
    this.cntservice.clear();
    this.cntcomp.updateData();
  } 
  save_det(phist:Hist,):void {
    let tblitems:Tblitems[]=[];
    for (let i=0;i<phist.deta.length;++i){
      tblitems.push({
        "prc": phist.deta[i].prc[0],
        "cnt" :phist.deta[i].cnt,
        "gds" :phist.deta[i].gds,
        "idx" :phist.deta[i].idx,
        "ctg" :phist.deta[i].ctg
      });
    }
    // console.log("save_det",tblitems);

    this.apollo.mutate<any>({
    mutation: Query.InsertDetail,
    variables: {
        "object": {
          "headid": this.headservice.headid,
          "index" : phist.index,
          "time" :  phist.time,
          "sum" :   phist.head.sum,
          "zei" :   phist.head.zei,
          "rat" :   phist.head.rat,
          "tkbn" :  phist.head.tkbn,
          "zkbn" :  phist.head.zkbn,
          "neb" :   phist.head.neb,
          "cus" :   phist.head.cus,
          "payt" :  phist.head.payt,
          "usrid" : 'dummy',
          "tblitems": { "data": tblitems }
        }
      },
    }).subscribe(({ data }) => {
      // console.log('insert detail', data);
    },(error) => {
      console.log('error InsertDetail', error);
    });
  }      
  update_stock():void  { 
    // console.log("updstock",this.goodsservice.goods);
    for (let i=0;i<this.goodsservice.goods.length;++i){
      for (let j=0;j<this.goodsservice.goods[i].ginfo.length;++j){
        this.apollo.mutate<any>({
          mutation: Query.UpdateStock,
          variables: {
            headid: this.headservice.headid,
            gcode : this.goodsservice.goods[i].ginfo[j].gcode,
            stock : this.goodsservice.goods[i].ginfo[j].stock
          },
        }).subscribe(({ data }) => {
          // console.log('updatestock', data);
        },(error) => {
          console.log('error UpdateStock', error);
        });
      }
    }
  }  
}