import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public routeLinks: any[];
  constructor() {
    this.routeLinks = [
      { label: 'データ選択', link: 'tab01', icon: 'dashboard' },
      { label: 'レジ', link: 'tab02', icon: 'shopping_cart' },
      { label: '履歴', link: 'tab03', icon: 'list' },
      { label: '集計', link: 'tab04', icon: 'save_alt' }
    ];
  }

  ngOnInit(): void {
    const color:string = localStorage.getItem('MWJPOS_COLOR');
    if ( color !== null ){this.setColor(color);}
  }

  setColor(colorname:string):void {
    var links = document.getElementsByTagName("link"); 
    for(var i=0; i < links.length; i++) {
        var link = links[i];
        if (link.id=='themeAsset') {
          link.href = 'https://unpkg.com/@angular/material/prebuilt-themes/' + colorname + '.css';
        }
      }
    localStorage.setItem('MWJPOS_COLOR', colorname);
  }
}
