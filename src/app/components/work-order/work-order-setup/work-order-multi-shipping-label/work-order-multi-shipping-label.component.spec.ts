/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WorkOrderMultiShippingLabelComponent } from './work-order-multi-shipping-label.component';

describe('WorkOrderMultiShippingLabelComponent', () => {
  let component: WorkOrderMultiShippingLabelComponent;
  let fixture: ComponentFixture<WorkOrderMultiShippingLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkOrderMultiShippingLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderMultiShippingLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
