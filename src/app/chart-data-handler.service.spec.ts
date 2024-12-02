import { TestBed } from '@angular/core/testing';

import { ChartDataHandlerService } from './chart-data-handler.service';

describe('ChartDataHandlerService', () => {
  let service: ChartDataHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartDataHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
