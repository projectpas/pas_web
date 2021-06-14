/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpeedQuotePrintingTemplateComponent } from './speed-quote-printing-template.component';

describe('SpeedQuotePrintingTemplateComponent', () => {
  let component: SpeedQuotePrintingTemplateComponent;
  let fixture: ComponentFixture<SpeedQuotePrintingTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedQuotePrintingTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedQuotePrintingTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
