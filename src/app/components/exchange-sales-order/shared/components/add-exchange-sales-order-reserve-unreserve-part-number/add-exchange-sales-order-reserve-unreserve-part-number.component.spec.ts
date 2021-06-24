/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddExchangeSalesOrderReserveUnreservePartNumberComponent } from './add-exchange-sales-order-reserve-unreserve-part-number.component';

describe('AddExchangeSalesOrderReserveUnreservePartNumberComponent', () => {
  let component: AddExchangeSalesOrderReserveUnreservePartNumberComponent;
  let fixture: ComponentFixture<AddExchangeSalesOrderReserveUnreservePartNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExchangeSalesOrderReserveUnreservePartNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExchangeSalesOrderReserveUnreservePartNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
