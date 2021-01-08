/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { RepairOrderComponent } from './repair-order.component';

let component: RepairOrderComponent;
let fixture: ComponentFixture<RepairOrderComponent>;

describe('repair-order component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RepairOrderComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(RepairOrderComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});