/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { RfqEngineComponent } from './rfq-engine.component';

let component: RfqEngineComponent;
let fixture: ComponentFixture<RfqEngineComponent>;

describe('RfqEngine component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RfqEngineComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(RfqEngineComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});