/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { DealsListComponent } from './deals-list.component';

let component: DealsListComponent;
let fixture: ComponentFixture<DealsListComponent>;

describe('DealsList component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DealsListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(DealsListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});