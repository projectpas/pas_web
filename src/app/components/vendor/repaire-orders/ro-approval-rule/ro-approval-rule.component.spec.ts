/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RoApprovalRuleComponent } from './ro-approval-rule.component';

describe('RoApprovalRuleComponent', () => {
  let component: RoApprovalRuleComponent;
  let fixture: ComponentFixture<RoApprovalRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoApprovalRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoApprovalRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
