/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { DealSetupComponent } from './deal-setup.component';

let component: DealSetupComponent;
let fixture: ComponentFixture<DealSetupComponent>;

describe('customer-steps-primeng component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DealSetupComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(DealSetupComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});