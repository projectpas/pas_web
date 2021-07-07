/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExchangeSalesOrderMultiPackagingLabelComponent } from './exchange-sales-order-multi-Packaging-Label.component';

describe('ExchangeSalesOrderMultiPackagingLabelComponent', () => {
  let component: ExchangeSalesOrderMultiPackagingLabelComponent;
  let fixture: ComponentFixture<ExchangeSalesOrderMultiPackagingLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeSalesOrderMultiPackagingLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeSalesOrderMultiPackagingLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
