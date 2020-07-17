import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeJa from '@angular/common/locales/ja';
import { FormsModule } from '@angular/forms';
import { GraphQLModule } from './graph-ql/graph-ql.module';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { LayoutModule } from '@angular/cdk/layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Tab01Component } from './tabs/tab01.component';
import { Tab02Component } from './tabs/tab02.component';
import { Tab03Component } from './tabs/tab03.component';
import { Tab04Component } from './tabs/tab04.component';
import { NavbarComponent } from './navbar/navbar.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ZeiKbnPipe } from './pipes/zei-kbn.pipe';
import { TankaKbnPipe } from './pipes/tanka-kbn.pipe';
import { PercentInputPipe } from './pipes/percent-input.pipe';
import { NumberInputPipe } from './pipes/number-input.pipe';
import { PercentInputDirective } from './drctvs/percent-input.directive';
import { NumberInputDirective } from './drctvs/number-input.directive';
import { CounttblComponent } from './tblcount/counttbl.component';
import { HistorytblComponent } from './tblhist/historytbl.component';
import { PayTypePipe } from './pipes/pay-type.pipe';
registerLocaleData(localeJa);

@NgModule({
  declarations: [
    AppComponent,
    Tab01Component,
    Tab02Component,
    Tab03Component,
    Tab04Component,
    NavbarComponent,
    ZeiKbnPipe,
    TankaKbnPipe,
    PercentInputPipe,
    NumberInputPipe,
    PercentInputDirective,
    NumberInputDirective,
    CounttblComponent,
    HistorytblComponent,
    PayTypePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatBadgeModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
    FormsModule,
    FlexLayoutModule,
    GraphQLModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  providers: [ 
    { provide: LOCALE_ID, useValue: "ja-JP" },
    NumberInputPipe,PercentInputPipe 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
