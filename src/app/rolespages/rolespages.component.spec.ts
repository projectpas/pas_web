/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { RolespagesComponent } from './rolespages.component';

let component: RolespagesComponent;
let fixture: ComponentFixture<RolespagesComponent>;

describe('rolespages component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RolespagesComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(RolespagesComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});