/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { Master1099Component } from './master1099.component';

let component: Master1099Component;
let fixture: ComponentFixture<Master1099Component>;

describe('master1099 component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ Master1099Component ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(Master1099Component);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});