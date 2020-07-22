import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Header, HeaderService }  from '../srvs/header.service';
import { Hist, HistoryService } from '../srvs/history.service';
import { GoodsService } from '../srvs/goods.service';
import { Count } from '../srvs/counts.service';
import { Apollo } from 'apollo-angular';
import * as Query from '../graph-ql/queries';

@Component({
  selector: 'app-historytbl',
  templateUrl: './historytbl.component.html',
  styleUrls: ['./historytbl.component.scss']
})
export class HistorytblComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @Output() action = new EventEmitter();
  displayedColumns = ['checked','index','head.cus','head.payt','time','head.mem','head.sum'];
  dataSource = new MatTableDataSource<Hist>(this.hstsrv.hists);

  constructor(public hstsrv:HistoryService,
              public hedsrv: HeaderService,
              public goodsservice: GoodsService,
              private apollo: Apollo) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;    
    this.hstsrv.observe.subscribe(() => this.refresh());
  }

  deleteHist(){
    // console.log("deletehist先頭",this.hstsrv.hists); 
    for (let i = 0; i < this.hstsrv.hists.length; i++) {
      const hist:Hist = this.hstsrv.hists[i];
      if( hist.checked ) {
        const data:Count[]=hist.deta;
        for (let i=0;i<data.length;++i){
          this.goodsservice.decreGoods(data[i].cid,data[i].idx,data[i].cnt);
        } 
        // this.goodsservice.update_stock(this.hedsrv.headid,data);
        this.apollo.mutate<any>({
          mutation: Query.DeleteDetail,
          variables: {
            headid: this.hedsrv.headid,
            index : hist.index,
            usrid : "dummy"
          },
        }).subscribe(({ data }) => {
          // console.log('DeleteDetail', data);
          this.hstsrv.hists.splice(i,1);
          this.hstsrv.calc_total();
          this.refresh();
        },(error) => {
          console.log('error DeleteDetail', error);
        });       
      }
    }
    // tblstockを更新
    // this.hstsrv.subject.next();
    // console.log('DeleteDetail後', this.hstsrv.total);
    // this.refresh();
  }

  update(){
    console.log("読込後",this.hstsrv.hists);

  } 

  refresh(){
    // this.hstsrv.get_Hists().subscribe((data: Hist[]) => {
    //   console.log("tbl refresh",data);     
    //   this.dataSource.data = data;
    // });
    // console.log("tbl refresh",this.hstsrv.hists);  
    this.dataSource= new MatTableDataSource<Hist>(this.hstsrv.hists);
    this.dataSource.paginator = this.paginator;
  }
}
