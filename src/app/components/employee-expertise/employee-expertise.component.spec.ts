/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { EmployeeExpertiseComponent } from './employee-expertise.component';

let component: EmployeeExpertiseComponent;
let fixture: ComponentFixture<EmployeeExpertiseComponent>;

describe('EmployeeExpertise component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EmployeeExpertiseComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(EmployeeExpertiseComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});