/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { UnitOfMeasureComponent } from './unit-of-measure.component';

let component: UnitOfMeasureComponent;
let fixture: ComponentFixture<UnitOfMeasureComponent>;

describe('UnitOfMeasure component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ UnitOfMeasureComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(UnitOfMeasureComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});