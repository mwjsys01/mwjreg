import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as Query from '../graph-ql/queries';
import { Header, HeaderService }  from '../srvs/header.service';
import { Ginfo,Goods,GoodsService } from '../srvs/goods.service';
import { SelVal,Cust, CustomerService } from '../srvs/customer.service';
import { Count,Cnthead,CountsService } from '../srvs/counts.service';
import { Hist, Tblitems, HistoryService } from '../srvs/history.service';
import { TankakbnService } from '../srvs/tankakbn.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab01',
  templateUrl: './tab01.component.html',
  styleUrls: ['./tab01.component.scss']
})
export class Tab01Component implements OnInit {
  constructor(public hedsrv: HeaderService,
              public goodsservice: GoodsService,
              public custservice: CustomerService,
              public cntservice: CountsService,
              public hisservice: HistoryService,
              public tnkservice: TankakbnService,
              private router: Router,
              private apollo: Apollo) { }

  ngOnInit(): void {
    this.qry_Headers();
    this.qry_Tankakbn();
    // this.hedsrv.observe.subscribe();
  }
  // select選択時読込処理
  read_Data(value:number):void {
    // サービス初期化 
    this.goodsservice.resetGoods();
    this.hisservice.reset_Hists();
    this.hedsrv.loaded=false;
    // this.cntservice.reset(); 
    // tblcustomをcustomerserviceへ読込
    let adCus: Cust;
    let adSel: SelVal;   
    if (this.hedsrv.header.type == 'SHOP'){
      this.apollo.watchQuery<any>({
        query: Query.GetQuery3,
        variables: { 
          scode: this.hedsrv.header.code
          },
      })
      .valueChanges
      .subscribe(({ data }) => {
        this.custservice.reset();
        for ( let i=0;i<data.tmpshop_tblcustomer.length;i=i+1 ){
          adSel = { value:data.tmpshop_tblcustomer[i].mcode, viewValue:data.tmpshop_tblcustomer[i].name}
          adCus = { code:data.tmpshop_tblcustomer[i].mcode,tkbn:data.tmpshop_tblcustomer[i].tkbn,zkbn:data.tmpshop_tblcustomer[i].zkbn };
          this.custservice.addSval(adSel);
          this.custservice.addCust(adCus);
        }
        this.cntservice.reset();
        // this.cntservice.cnthead.cus=this.custservice.getCust()[0].code;
        // this.cntservice.setKbn(this.custservice.getCust()[0].tkbn,this.custservice.getCust()[0].zkbn);
      });
    } else { //大会
      this.custservice.reset();
      adSel = { value:this.hedsrv.header.code, viewValue:'大会'}
      adCus = { code:this.hedsrv.header.code, tkbn:1, zkbn:'1' };
      this.custservice.addSval(adSel);
      this.custservice.addCust(adCus);
      this.cntservice.reset();
      // this.cntservice = new CountsService();
      // this.cntservice.setKbn(1,"1");
      // // this.hedsrv.header.exp=true;
      // this.cntservice.cnthead.cus=this.hedsrv.header.code;
      // console.log('tai',this.cntservice);
    }
    // tblstockをgoodsserviceへ読込
    this.apollo.watchQuery<any>({
    query: Query.GetQuery2,
    variables: { 
      headid: this.hedsrv.headid
    },
    })
    .valueChanges
    .subscribe(({ data }) => {
      let adInf: Ginfo[];
      let adBtn: Goods; 
      for ( let i=0;i<data.tmpshop_tblstock.length;i=i+1 ){
        adInf = [{index:data.tmpshop_tblstock[i].index,
                  gcode:data.tmpshop_tblstock[i].gcode,
                  gname:data.tmpshop_tblstock[i].gname,
                  stock:+data.tmpshop_tblstock[i].stock,
          price:[0,data.tmpshop_tblstock[i].price1,
                  data.tmpshop_tblstock[i].price2,
                  data.tmpshop_tblstock[i].price3,
                  data.tmpshop_tblstock[i].price4,
                  data.tmpshop_tblstock[i].price5]}];
        adBtn = { catid: data.tmpshop_tblstock[i].catid,categ: data.tmpshop_tblstock[i].categ, ginfo: adInf } ;
        this.goodsservice.addGoods(adBtn);  
      }
      this.goodsservice.subject.next();
      if (this.hedsrv.header.status == 'EDIT'){
        // tbldetails-tblitemsをhistoryserviceへ読込
        // console.log("Query前",this.hisservice.hists);
        this.apollo.watchQuery<any>({
          query: Query.GetQuery5,
          variables: { 
            headid: this.hedsrv.headid
          },
          })
          .valueChanges
          .subscribe(({ data }) => {
            const detas=data.tmpshop_tblheader_by_pk.tbldetails;
            // console.log("subscribe" ,detas);
            if ( this.hedsrv.loaded == false){
              this.hedsrv.loaded = true;
              for ( let i=0;i<detas.length;i=i+1 ){
                this.cntservice.cnthead=detas[i];
                for (let j=0;j<detas[i].tblitems.length;j++){ 
                  // 
                  // console.log(detas[i].tblitems[j].cid,detas[i].tblitems[j].idx);
                  // console.log("tab01read",this.hisservice);
                  const ginfo:Ginfo=this.goodsservice.getGinfo( detas[i].tblitems[j].cid,
                                                                detas[i].tblitems[j].idx);
                  let lcprc:number[]=ginfo.price;
                  lcprc[0]=detas[i].tblitems[j].prc;
                  this.cntservice.setList(
                    detas[i].tblitems[j].cid,
                    detas[i].tblitems[j].idx,
                    detas[i].tblitems[j].gds,
                    lcprc,
                    detas[i].tblitems[j].cnt,
                    ginfo.gname); 
                    this.goodsservice.decreGoods(
                      detas[i].tblitems[j].cid,
                      detas[i].tblitems[j].idx,
                      detas[i].tblitems[j].cnt * -1
                    );
                }
                // console.log("calc_sum後",this.cntservice);
                this.cntservice.calc_sum();
                const hist:Hist = { checked:false,
                                    index:detas[i].index,
                                    time:detas[i].time,
                                    head:this.cntservice.cnthead,
                                    rusr:detas[i].usrid,
                                    deta:this.cntservice.items
                  }
                this.hisservice.addHists(hist);
                this.cntservice.reset();
              }
              this.hisservice.calc_total();
              this.cntservice.reset();
              // console.log("calc_sum後",this.cntservice);
            }
          });
      }  
    });
      
    this.router.navigate(['/tab02']);
  }

  onChange():void  {
    this.hedsrv.placehold = 'データ選択';
    this.qry_Headers();
  }  

  selected(){
    const i:number = this.hedsrv.headers.findIndex(obj => obj.headid == this.hedsrv.headid);
    if(i > -1 ){
      this.hedsrv.header = this.hedsrv.headers[i];
    } else {
      this.hedsrv.header = new Header();  
    }
    this.read_Data(this.hedsrv.header.headid);
  }  
  qry_Tankakbn():void {
    this.apollo.watchQuery<any>({
      query: Query.GetQuery4
    })
      .valueChanges
      .subscribe(({ data })=> {
        this.tnkservice.tbldata=data.tmpshop_tbltankakbn;
      });
  }
  qry_Headers():void {
  　let lctype   : string;
    let lcstatus :string[]=[];
    if (this.hedsrv.RDVAL == "1") {
      lctype = 'SHOP';
    } else {
      lctype = 'CMPE';
    }
    if (this.hedsrv.chNEW) {
      lcstatus.push('NEW');
    }
    if (this.hedsrv.chEDIT) {
      lcstatus.push('EDIT');
    }
    if (this.hedsrv.chCSV) {
      lcstatus.push('CSV');
    }
    // console.log(lcstatus,lctype);
    this.apollo.watchQuery<any>({
      query: Query.GetQuery1,
      variables: { 
        status : lcstatus ,
        type : lctype
        },
    })
      .valueChanges
      .subscribe(({ data })=> {
        if (data.tmpshop_tblheader.length == 0){
          this.hedsrv.headers=[];
          this.hedsrv.placehold = '該当データなし';
        } else {
          this.hedsrv.headers=data.tmpshop_tblheader;
          this.hedsrv.placehold = 'データ選択';
        }    
    });
  }
  test(){

  }
}
