/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CustomerWorkEditComponent } from './customer-work-edit.component';

let component: CustomerWorkEditComponent;
let fixture: ComponentFixture<CustomerWorkEditComponent>;

describe('CustomerWorkEdit component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CustomerWorkEditComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CustomerWorkEditComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});