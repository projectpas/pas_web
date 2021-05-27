/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpeedQuoteExclusionsComponent } from './speed-quote-exclusions.component';

describe('SpeedQuoteExclusionsComponent', () => {
  let component: SpeedQuoteExclusionsComponent;
  let fixture: ComponentFixture<SpeedQuoteExclusionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedQuoteExclusionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedQuoteExclusionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
