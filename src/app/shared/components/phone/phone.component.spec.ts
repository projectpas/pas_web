/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { PhoneComponent } from './phone.component';

let component: PhoneComponent;
let fixture: ComponentFixture<PhoneComponent>;

describe('MemoComponent component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PhoneComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(PhoneComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});