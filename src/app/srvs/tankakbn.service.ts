import { Injectable } from '@angular/core';

export class Tkbn {
  tkbn: number;
  name: string;
  constructor(init?:Partial<Tkbn>) {
    Object.assign(this, init);
  }
}

@Injectable({
  providedIn: 'root'
})
export class TankakbnService {
  tbldata:Tkbn[]=[];
  constructor() { }
}
