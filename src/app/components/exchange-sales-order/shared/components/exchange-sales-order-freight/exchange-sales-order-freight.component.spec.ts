/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExchangeSalesOrderFreightComponent } from './exchange-sales-order-freight.component';

describe('ExchangeSalesOrderFreightComponent', () => {
  let component: ExchangeSalesOrderFreightComponent;
  let fixture: ComponentFixture<ExchangeSalesOrderFreightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeSalesOrderFreightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeSalesOrderFreightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
