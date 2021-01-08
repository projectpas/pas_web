/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { EmployeeStepsPrimeNgComponent } from './employee-steps-prime-ng.component';

let component: EmployeeStepsPrimeNgComponent;
let fixture: ComponentFixture<EmployeeStepsPrimeNgComponent>;

describe('employee-steps-primeNg component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EmployeeStepsPrimeNgComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(EmployeeStepsPrimeNgComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});