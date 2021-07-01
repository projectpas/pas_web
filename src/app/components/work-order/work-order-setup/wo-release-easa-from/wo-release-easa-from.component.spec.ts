/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WoReleaseEasaFromComponent } from './wo-release-easa-from.component';

describe('WoReleaseEasaFromComponent', () => {
  let component: WoReleaseEasaFromComponent;
  let fixture: ComponentFixture<WoReleaseEasaFromComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WoReleaseEasaFromComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WoReleaseEasaFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
