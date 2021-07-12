/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExchangeSalesOrderChargesComponent } from './exchange-sales-order-charges.component';

describe('ExchangeSalesOrderChargesComponent', () => {
  let component: ExchangeSalesOrderChargesComponent;
  let fixture: ComponentFixture<ExchangeSalesOrderChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeSalesOrderChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeSalesOrderChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
