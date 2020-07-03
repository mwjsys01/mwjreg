import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Hist, HistoryService } from '../srvs/history.service';

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

  constructor(public hstsrv:HistoryService) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;    
    this.hstsrv.observe.subscribe(() => this.refresh());
  }

  update(){
    this.refresh();
  } 

  refresh(){
    // this.hstsrv.get_Hists().subscribe((data: Hist[]) => {
    //   console.log("tbl refresh",data);     
    //   this.dataSource.data = data;
    // });
    this.dataSource= new MatTableDataSource<Hist>(this.hstsrv.hists);
    this.dataSource.paginator = this.paginator;
  }
}
