/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AllViewComponent } from './all-view.component';

describe('AllViewComponent', () => {
  let component: AllViewComponent;
  let fixture: ComponentFixture<AllViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
