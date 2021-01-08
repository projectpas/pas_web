/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { OpenCloseArsubledgerComponent } from './open-close-ar-subledger.component';

let component: OpenCloseArsubledgerComponent;
let fixture: ComponentFixture<OpenCloseArsubledgerComponent>;

describe('open-close-AR-subledger component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ OpenCloseArsubledgerComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(OpenCloseArsubledgerComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});