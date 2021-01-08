/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SOQApprovalRuleComponent } from './soq-approval-rule.component';

describe('SOQApprovalRuleComponent', () => {
  let component: SOQApprovalRuleComponent;
  let fixture: ComponentFixture<SOQApprovalRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SOQApprovalRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SOQApprovalRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
