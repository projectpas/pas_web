/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpeedQuoteCustpmerDetailsComponent } from './speed-quote-custpmer-details.component';

describe('SpeedQuoteCustpmerDetailsComponent', () => {
  let component: SpeedQuoteCustpmerDetailsComponent;
  let fixture: ComponentFixture<SpeedQuoteCustpmerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedQuoteCustpmerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedQuoteCustpmerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
