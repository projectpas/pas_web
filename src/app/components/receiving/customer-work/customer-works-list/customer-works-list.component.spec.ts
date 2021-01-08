/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CustomerWorksListComponent } from './customer-works-list.component';

let component: CustomerWorksListComponent;
let fixture: ComponentFixture<CustomerWorksListComponent>;

describe('CustomerWorksList component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CustomerWorksListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CustomerWorksListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});