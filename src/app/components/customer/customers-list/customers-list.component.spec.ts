/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CustomersListComponent } from './customers-list.component';

let component: CustomersListComponent;
let fixture: ComponentFixture<CustomersListComponent>;

describe('CustomersList component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CustomersListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CustomersListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});