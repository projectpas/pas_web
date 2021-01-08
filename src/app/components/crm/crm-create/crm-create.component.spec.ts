/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CrmCreateComponent } from './crm-create.component';

let component: CrmCreateComponent;
let fixture: ComponentFixture<CrmCreateComponent>;

describe('customer-steps-primeng component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CrmCreateComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CrmCreateComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});