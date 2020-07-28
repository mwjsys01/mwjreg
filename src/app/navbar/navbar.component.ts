import { Component, OnInit } from '@angular/core';
import { HeaderService }  from '../srvs/header.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public routeLinks: any[];
  constructor(public hedsrv: HeaderService) {
    this.routeLinks = [
      { label: 'データ選択', link: 'tab01', icon: 'dashboard' },
      { label: 'レジ', link: 'tab02', icon: 'shopping_cart' },
      { label: '履歴', link: 'tab03', icon: 'list' },
      { label: '集計', link: 'tab04', icon: 'save_alt' }
    ];
  }

  ngOnInit(): void {
    const color:string = localStorage.getItem('MWJREG_COLOR');
    if ( color !== null ){this.setColor(color);}
    this.hedsrv.regusr = localStorage.getItem('MWJREG_USER');
  }

  setColor(colorname:string):void {
    var links = document.getElementsByTagName("link"); 
    for(var i=0; i < links.length; i++) {
        var link = links[i];
        if (link.id=='themeAsset') {
          link.href = 'https://unpkg.com/@angular/material/prebuilt-themes/' + colorname + '.css';
        }
      }
    localStorage.setItem('MWJREG_COLOR', colorname);
  }
  setUser():void {
    localStorage.setItem('MWJREG_USER', this.hedsrv.regusr);
  }
}
