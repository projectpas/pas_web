/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WorkOrderMultiPackagingLabelComponent } from './wo-order-multi-Packaging-Label.component';

describe('WorkOrderMultiPackagingLabelComponent', () => {
  let component: WorkOrderMultiPackagingLabelComponent;
  let fixture: ComponentFixture<WorkOrderMultiPackagingLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOrderMultiPackagingLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderMultiPackagingLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
