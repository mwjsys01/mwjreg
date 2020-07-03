import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounttblComponent } from './counttbl.component';

describe('CounttblComponent', () => {
  let component: CounttblComponent;
  let fixture: ComponentFixture<CounttblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounttblComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounttblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
