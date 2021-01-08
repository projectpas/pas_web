/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { EmployeeCertificationComponent } from './employee-certification.component';

let component: EmployeeCertificationComponent;
let fixture: ComponentFixture<EmployeeCertificationComponent>;

describe('EmployeeCertification component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EmployeeCertificationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(EmployeeCertificationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});