/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CrmListComponent } from './crm-list.component';

let component: CrmListComponent;
let fixture: ComponentFixture<CrmListComponent>;

describe('CrmList component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CrmListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CrmListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});