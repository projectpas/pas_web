/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpeedQuoteExclusionPrintTemplateComponent } from './speed-quote-exclusion-print-template.component';

describe('SpeedQuoteExclusionPrintTemplateComponent', () => {
  let component: SpeedQuoteExclusionPrintTemplateComponent;
  let fixture: ComponentFixture<SpeedQuoteExclusionPrintTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedQuoteExclusionPrintTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedQuoteExclusionPrintTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
