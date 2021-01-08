/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { DealAlternateComponent } from './deal-alternate.component';

let component: DealAlternateComponent;
let fixture: ComponentFixture<DealAlternateComponent>;

describe('item-master-stock component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DealAlternateComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(DealAlternateComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});