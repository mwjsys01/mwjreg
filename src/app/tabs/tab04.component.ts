import { Component, OnInit, ElementRef, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Total, HistoryService } from '../srvs/history.service';
import { CustomerService } from '../srvs/customer.service';
import { HeaderService } from '../srvs/header.service';
import { formatDate } from '@angular/common';
import * as Encoding from 'encoding-japanese';
import * as FileSaver from 'file-saver';
import { Apollo } from 'apollo-angular';
import * as Query from '../graph-ql/queries';

@Component({
  selector: 'app-tab04',
  templateUrl: './tab04.component.html',
  styleUrls: ['./tab04.component.scss']
})
export class Tab04Component implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  // @Output() action = new EventEmitter();
  displayedColumns = ['custo','payty','total','gcode','price','count'];
  dataSource = new MatTableDataSource<Total>(this.hstsrv.total);

  constructor(@Inject(LOCALE_ID) private locale: string,
              // private elementRef: ElementRef,
              public hstsrv:HistoryService,
              public cussrv:CustomerService,
              public hedsrv:HeaderService,
              private apollo: Apollo) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;    
    this.hstsrv.observe.subscribe(() => this.refresh());  
  }

  refresh(): void{
    this.dataSource= new MatTableDataSource<Total>(this.hstsrv.total);
    this.dataSource.paginator = this.paginator;
  }

  public async dlCsv() {
    // console.log("tab04",this.hstsrv); 
    const csv:string = await this.makeCsv();
    const unicode_array = this.str_to_unicode_array( csv );
    const sjis_code_array = Encoding.convert( 
      unicode_array, // ※文字列ではない点に注意
      'SJIS',  // to
      'UNICODE' // from
    );
    const uint8_array = new Uint8Array( sjis_code_array );
    // const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([uint8_array], { type: 'text/csv' });
    // const url = window.URL.createObjectURL(blob);
    const now = new Date();
    const filename = formatDate(now, "yyMMdd_HHmm", this.locale) + 'mwjreg.csv'
    FileSaver.saveAs(blob, filename);

    this.apollo.mutate<any>({
      mutation: Query.UpdateStatus,
      variables: { 
        headid: this.hedsrv.headid ,
        timest: new Date(),
        status: 'CMPL'
        },
       }).subscribe(({ data }) => {
          // console.log('got data', data);
       },(error) => {
          console.log('there was an error sending the query', error);
       });
  }

  makeCsv():Promise<string>{
    return new Promise<string>(resolve => {
      const tot:Total[] = this.hstsrv.total;
      let csvdata:string="";
      let lccus:string="";
      let lcpay:string="";
      let csv:string="";
      let now = new Date();
      for(let i=0; i<tot.length; i++) {
        let j:number = this.cussrv.sval.findIndex(o => o.value==tot[i].custo)
        let k:number = this.cussrv.cust.findIndex(o => o.code==tot[i].custo)

        if(tot[i].custo==lccus && tot[i].payty==lcpay) {
          csv += tot[i].gcode + "," +  tot[i].price + "," 
               + tot[i].count + "," +  this.cussrv.cust[k].zkbn + ",,"      
        } else {
          lccus=tot[i].custo;
          lcpay=tot[i].payty;
          if (csv !== "" ) {
            csvdata += csv + "99999999999999999999" + "\n";
          }
            //ヘッダ情報セット
          csv=",,"; //№1～2 空白
          if(tot[i].payty == "1"){ //3 取引区分(0:都度 1:卸)
            csv += "1,";  
          } else {
            csv += "0,";
          }
          csv += tot[i].custo + ",,,";                            //4 受注先コード 5～6 空白
          csv += this.cussrv.sval[j].viewValue + ",".repeat(9);   //7 受注先氏名 8～15 空白
          csv += "レジアプリ" + ",".repeat(86);                      //16 住所1 17～101 空白
          csv += formatDate(now, "yyyyMMdd", this.locale) + ",01,"; //102 受付日 103 部門
          if(this.hedsrv.header.type == "CMPE"){                    //104 倉庫
            csv += "01,";
          } else {
            csv += this.hedsrv.header.code + ",";
          }
          csv += "1,";                                              //105 受注方法 電話        
          csv += tot[i].payty+ "," + ",".repeat(13);                //106 入金方法 107～119
          if(this.hedsrv.header.name.length > 41) {                      //120～121 伝票備考
            csv += this.hedsrv.header.name.substring( 0, 40) + ",";                    
            csv += this.hedsrv.header.name.substring( 41, 40) + ",";                     
          } else {  
            csv += this.hedsrv.header.name + ",,"; 
          }
          csv += ",".repeat(19);　　　　　　　　　　　　　　　　　　　　//122～140 空白
          csv += tot[i].gcode + "," +  tot[i].price + "," 
               + tot[i].count + "," +  this.cussrv.cust[k].zkbn + ",,"
        }
      } 
      csvdata += csv + "99999999999999999999"; 
      resolve(csvdata);
    });  
  }
  str_to_unicode_array( str:string ){
    let arr = [];
    for( let i = 0; i < str.length; i ++ ){
      arr.push( str.charCodeAt( i ) );
    }
    return arr;
  };
}
 