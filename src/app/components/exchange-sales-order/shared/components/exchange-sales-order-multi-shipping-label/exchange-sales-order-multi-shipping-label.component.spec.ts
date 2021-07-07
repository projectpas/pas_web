/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExchangeSalesOrderMultiShippingLabelComponent } from './exchange-sales-order-multi-shipping-label.component';

describe('ExchangeSalesOrderMultiShippingLabelComponent', () => {
  let component: ExchangeSalesOrderMultiShippingLabelComponent;
  let fixture: ComponentFixture<ExchangeSalesOrderMultiShippingLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeSalesOrderMultiShippingLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeSalesOrderMultiShippingLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
