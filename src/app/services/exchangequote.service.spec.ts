/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExchangequoteService } from './exchangequote.service';

describe('Service: Exchangequote', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExchangequoteService]
    });
  });

  it('should ...', inject([ExchangequoteService], (service: ExchangequoteService) => {
    expect(service).toBeTruthy();
  }));
});
