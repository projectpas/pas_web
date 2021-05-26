/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PurchaseOrderPrintTemplateComponent } from './purchase-order-print-template.component';

describe('PurchaseOrderPrintTemplateComponent', () => {
  let component: PurchaseOrderPrintTemplateComponent;
  let fixture: ComponentFixture<PurchaseOrderPrintTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderPrintTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderPrintTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
