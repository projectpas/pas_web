/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ReceivngPoComponent } from './receivng-po.component';

let component: ReceivngPoComponent;
let fixture: ComponentFixture<ReceivngPoComponent>;

describe('receivng-po component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ReceivngPoComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ReceivngPoComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});