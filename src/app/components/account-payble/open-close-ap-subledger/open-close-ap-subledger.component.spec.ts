/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { OpenCloseApSubledgerComponent } from './open-close-ap-subledger.component';

let component: OpenCloseApSubledgerComponent;
let fixture: ComponentFixture<OpenCloseApSubledgerComponent>;

describe('open-close-ap-subledger component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ OpenCloseApSubledgerComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(OpenCloseApSubledgerComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});