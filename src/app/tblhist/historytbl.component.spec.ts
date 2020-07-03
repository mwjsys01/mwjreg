import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorytblComponent } from './historytbl.component';

describe('HistorytblComponent', () => {
  let component: HistorytblComponent;
  let fixture: ComponentFixture<HistorytblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorytblComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorytblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
