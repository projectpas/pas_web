/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { StageCodeComponent } from './stage-code.component';

let component: StageCodeComponent;
let fixture: ComponentFixture<StageCodeComponent>;

describe('StageCode component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ StageCodeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(StageCodeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});