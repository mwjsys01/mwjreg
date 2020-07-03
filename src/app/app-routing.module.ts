import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Tab01Component } from './tabs/tab01.component';
import { Tab02Component } from './tabs/tab02.component';
import { Tab03Component } from './tabs/tab03.component';
import { Tab04Component } from './tabs/tab04.component';


const routes: Routes = [
  { path: '', 
    redirectTo: 'tab01',
    pathMatch: 'full' 
  },
  {
    path: 'tab01',
    component: Tab01Component
  },
  {
    path: 'tab02',
    component: Tab02Component
  },
  {
    path: 'tab03',
    component: Tab03Component
  },
  {
    path: 'tab04',
    component: Tab04Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
