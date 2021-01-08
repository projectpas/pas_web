/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { StocklinepagesComponent } from './stocklinepages.component';

let component: StocklinepagesComponent;
let fixture: ComponentFixture<StocklinepagesComponent>;

describe('stocklinepages component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ StocklinepagesComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(StocklinepagesComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});