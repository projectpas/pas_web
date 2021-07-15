/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateExchangeQuoteSettingsComponent } from './create-exchange-quote-settings.component';

describe('CreateExchangeQuoteSettingsComponent', () => {
  let component: CreateExchangeQuoteSettingsComponent;
  let fixture: ComponentFixture<CreateExchangeQuoteSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateExchangeQuoteSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExchangeQuoteSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
