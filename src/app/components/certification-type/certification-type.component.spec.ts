/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CertificationTypeComponent } from './certification-type.component';

let component: CertificationTypeComponent;
let fixture: ComponentFixture<CertificationTypeComponent>;

describe('certification-type component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CertificationTypeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CertificationTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});