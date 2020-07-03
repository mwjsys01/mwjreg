import { TestBed } from '@angular/core/testing';

import { TankakbnService } from './tankakbn.service';

describe('TankakbnService', () => {
  let service: TankakbnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TankakbnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
