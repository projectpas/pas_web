/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ShipviaComponent } from './shipvia.component';

let component: ShipviaComponent;
let fixture: ComponentFixture<ShipviaComponent>;

describe('Shipvia component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ShipviaComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ShipviaComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});