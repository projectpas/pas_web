/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WorkOrderShippingLabelComponent } from './work-order-shipping-label.component';

describe('WorkOrderShippingLabelComponent', () => {
  let component: WorkOrderShippingLabelComponent;
  let fixture: ComponentFixture<WorkOrderShippingLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkOrderShippingLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderShippingLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
