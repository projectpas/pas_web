/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddExchangeSalesOrderPartNumberComponent } from './add-exchange-sales-order-part-number.component';

describe('AddExchangeSalesOrderPartNumberComponent', () => {
  let component: AddExchangeSalesOrderPartNumberComponent;
  let fixture: ComponentFixture<AddExchangeSalesOrderPartNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExchangeSalesOrderPartNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExchangeSalesOrderPartNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
