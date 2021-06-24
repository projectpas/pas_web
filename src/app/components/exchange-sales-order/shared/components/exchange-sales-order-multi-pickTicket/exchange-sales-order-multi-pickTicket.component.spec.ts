/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExchangeSalesOrderMultiPickTicketComponent } from './exchange-sales-order-multi-pickTicket.component';

describe('ExchangeSalesOrderMultiPickTicketComponent', () => {
  let component: ExchangeSalesOrderMultiPickTicketComponent;
  let fixture: ComponentFixture<ExchangeSalesOrderMultiPickTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeSalesOrderMultiPickTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeSalesOrderMultiPickTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
