/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { GlCashFlowClassificationComponent } from './gl-cash-flow-classification.component';

let component: GlCashFlowClassificationComponent;
let fixture: ComponentFixture<GlCashFlowClassificationComponent>;

describe('gl-cash-flow-classification component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ GlCashFlowClassificationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(GlCashFlowClassificationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});