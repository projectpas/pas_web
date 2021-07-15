/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateExchangeSalesOrderSettingsComponent } from './create-exchange-sales-order-settings.component';

describe('CreateExchangeSalesOrderSettingsComponent', () => {
  let component: CreateExchangeSalesOrderSettingsComponent;
  let fixture: ComponentFixture<CreateExchangeSalesOrderSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateExchangeSalesOrderSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExchangeSalesOrderSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
