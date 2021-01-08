/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { LicTypeComponent } from './lic-type.component';

let component: LicTypeComponent;
let fixture: ComponentFixture<LicTypeComponent>;

describe('LicType component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LicTypeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(LicTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});