/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { EmployeesListComponent } from './employees-list.component';

let component: EmployeesListComponent;
let fixture: ComponentFixture<EmployeesListComponent>;

describe('employees-list component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EmployeesListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(EmployeesListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});