/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { OpportunitySetupComponent } from './opportunity-setup.component';

let component: OpportunitySetupComponent;
let fixture: ComponentFixture<OpportunitySetupComponent>;

describe('customer-steps-primeng component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ OpportunitySetupComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(OpportunitySetupComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});