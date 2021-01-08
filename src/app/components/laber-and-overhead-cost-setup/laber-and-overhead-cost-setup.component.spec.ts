/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { LaberAndOverheadCostSetupComponent } from './laber-and-overhead-cost-setup.component';

let component: LaberAndOverheadCostSetupComponent;
let fixture: ComponentFixture<LaberAndOverheadCostSetupComponent>;

describe('Laber-and-overhead-cost-setup component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LaberAndOverheadCostSetupComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(LaberAndOverheadCostSetupComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});