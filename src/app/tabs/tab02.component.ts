import { Component, OnInit, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
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
export class Tab02Component implements OnInit,AfterViewChecked {
  public tai_flg: boolean=true;
  public is_opened:boolean=false;
  @ViewChild(CounttblComponent,{static: false})　public cntcomp:CounttblComponent;
  constructor(public headservice: HeaderService,
              public goodsservice: GoodsService,
              public cntservice: CountsService,
              public custservice: CustomerService,
              public histservice: HistoryService,
              private elementRef: ElementRef,
              private apollo: Apollo) { }

  ngOnInit():void {
    // console.log("tab02oninit",this.elementRef.nativeElement.querySelector('mat-expansion-panel'));
    // 大会の時だけ開く
    // console.log('tai',this.cntservice);
    if (this.headservice.header.type == 'CMPE' && this.tai_flg == true && this.elementRef.nativeElement.querySelector('mat-expansion-panel') != 'null') {
      this.is_opened = true;
      this.tai_flg = false;
    }
  }
  ngAfterViewChecked():void {

  }
  disCount(i :number):void {
    this.cntservice.disCount(i,this.cntservice.cnthead.tkbn); 
    this.cntcomp.updateData();
    // this.cntservice.subject.next();
  }
  setKbn(custo:string):void {
    this.cntservice.cnthead.tkbn = this.custservice.getTkbn(custo);
    this.cntservice.cnthead.zkbn = this.custservice.getZkbn(custo);
    this.cntservice.setKbn(this.cntservice.cnthead.tkbn,this.cntservice.cnthead.zkbn);
    this.cntcomp.updateData();
    // this.cntservice.subject.next();
  }
  addList(Gds :string, Gnm :string, Prc :number[], Cid :number, Idx :number):void {
    this.cntservice.addList(Cid,Gds,Gnm,Prc,Idx);
    this.goodsservice.decreGoods(Cid,Idx,-1);
    this.cntcomp.updateData();
    // this.cntservice.subject.next();
    // this.goodsservice.subject.next();
  }
  addHist():void {
  // 登録ボタン
    // ヘッダステータス変更
    this.apollo.mutate<any>({
      mutation: Query.UpdateStatus,
      variables: { 
        headid: this.headservice.headid ,
        timest: new Date(),
        status: 'EDIT'
        },
      }).subscribe(({ data }) => {
          // console.log('got data', data);
      },(error) => {
          console.log('there was an error sending the query', error);
      });       
    const hist:Hist = {
        checked:false,
        index:this.histservice.getIndex(),
        time:new Date(),
        head:this.cntservice.cnthead,
        deta:this.cntservice.items
      };
    // historyserviceへ追加
    this.histservice.addHists(hist);
    this.histservice.calc_total();
    // tbldetails-tblitemsへ保存
    this.save_det(hist);
    // tblstockを更新
    this.goodsservice.update_stock(this.headservice.header.headid,this.cntservice.items);

    this.cntservice.reset();
    this.cntservice.cnthead.cus=this.custservice.getCust()[0].code;
    this.setKbn(this.cntservice.cnthead.cus);
    // this.cntservice.subject.next();
    this.cntcomp.updateData();
  }
  calc():void {
    this.cntservice.calc_sum();
  }
  cancel():void {
    // キャンセルボタン
    // console.log("tab02cancel",this.histservice);
    
    // console.log("tab02cancel",this.elementRef.nativeElement.querySelector('mat-expansion-panel'));
    const data:Count[]=this.cntservice.items;
    for (let i=0;i<data.length;++i){
      this.goodsservice.decreGoods(data[i].cid,data[i].idx,data[i].cnt);
    }
    this.cntservice.reset();
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
        "cid" :phist.deta[i].cid
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
}