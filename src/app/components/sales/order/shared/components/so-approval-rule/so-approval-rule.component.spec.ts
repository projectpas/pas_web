/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SOApprovalRuleComponent } from './so-approval-rule.component';

describe('SOApprovalRuleComponent', () => {
  let component: SOApprovalRuleComponent;
  let fixture: ComponentFixture<SOApprovalRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SOApprovalRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SOApprovalRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
