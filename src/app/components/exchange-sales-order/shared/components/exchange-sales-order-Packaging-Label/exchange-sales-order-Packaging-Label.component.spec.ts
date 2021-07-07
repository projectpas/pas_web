/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExchangeSalesOrderPackagingLabelComponent } from './exchange-sales-order-Packaging-Label.component';

describe('ExchangeSalesOrderPackagingLabelComponent', () => {
  let component: ExchangeSalesOrderPackagingLabelComponent;
  let fixture: ComponentFixture<ExchangeSalesOrderPackagingLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeSalesOrderPackagingLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeSalesOrderPackagingLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
