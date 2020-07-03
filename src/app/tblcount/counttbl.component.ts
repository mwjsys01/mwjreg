import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Count, CountsService } from '../srvs/counts.service';
import { GoodsService } from '../srvs/goods.service';

@Component({
  selector: 'app-counttbl',
  templateUrl: './counttbl.component.html',
  styleUrls: ['./counttbl.component.scss']
})
export class CounttblComponent implements OnInit {
  @Output() action = new EventEmitter();
  private countDif:number[]=[];
  dataSource = new MatTableDataSource<Count>(this.cntservice.items);;

  displayedColumns = ['gds','gnm','prc','cnt','sum','actionsColumn'];

  constructor(public cntservice: CountsService,
              public goodsservice: GoodsService) {}

  ngOnInit(): void {
    this.cntservice.observe.subscribe(() => this.updateData());
  }
  deleteRow(rowid: number){
    if (rowid > -1) {
      console.log('selrow',rowid);
      this.goodsservice.decreGoods(this.cntservice.items[rowid].ctg,
        this.cntservice.items[rowid].idx,this.cntservice.items[rowid].cnt);
      this.goodsservice.subject.next();   
      this.cntservice.items.splice(rowid,1);
    }
    this.updateData();    
  }
  setPrev(i: number, value: number){
    this.countDif[i] = value;
    console.log(this.countDif)
  }
  updateList(i: number, property: string, value: number){
    this.cntservice.items[i][property] = value;
    if(property=='cnt'){
      this.goodsservice.decreGoods(this.cntservice.items[i].ctg,
        this.cntservice.items[i].idx,-1);
      this.goodsservice.subject.next();
    } 
    this.updateData();
  }
  
  updateData(){
    //tableのデータソース更新
    this.cntservice.calc_sum();
    this.dataSource= new MatTableDataSource<Count>(this.cntservice.items);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  log(){
    console.log('tbldata',this.dataSource);
  }

}
