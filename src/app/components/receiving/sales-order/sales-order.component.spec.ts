/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { SalesOrderComponent } from './sales-order.component';

let component: SalesOrderComponent;
let fixture: ComponentFixture<SalesOrderComponent>;

describe('SalesOrder component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SalesOrderComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(SalesOrderComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});