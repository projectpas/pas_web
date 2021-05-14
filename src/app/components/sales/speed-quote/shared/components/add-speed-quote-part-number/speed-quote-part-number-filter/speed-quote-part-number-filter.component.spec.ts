/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpeedQuotePartNumberFilterComponent } from './speed-quote-part-number-filter.component';

describe('SpeedQuotePartNumberFilterComponent', () => {
  let component: SpeedQuotePartNumberFilterComponent;
  let fixture: ComponentFixture<SpeedQuotePartNumberFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedQuotePartNumberFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedQuotePartNumberFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
