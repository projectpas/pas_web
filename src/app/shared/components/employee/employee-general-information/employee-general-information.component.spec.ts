/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { EmployeeGeneralInformationComponent } from './employee-general-information.component';

let component: EmployeeGeneralInformationComponent;
let fixture: ComponentFixture<EmployeeGeneralInformationComponent>;

describe('EmployeeGeneralInformation component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EmployeeGeneralInformationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(EmployeeGeneralInformationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});