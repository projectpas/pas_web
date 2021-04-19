/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExchangeQuoteCustomerApprovalComponent } from './exchange-quote-customer-approval.component';

describe('ExchangeQuoteCustomerApprovalComponent', () => {
  let component: ExchangeQuoteCustomerApprovalComponent;
  let fixture: ComponentFixture<ExchangeQuoteCustomerApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeQuoteCustomerApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeQuoteCustomerApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
