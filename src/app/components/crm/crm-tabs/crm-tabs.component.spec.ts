/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CrmTabsComponent } from './crm-tabs.component';

let component: CrmTabsComponent;
let fixture: ComponentFixture<CrmTabsComponent>;

describe('item-master-stock component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CrmTabsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CrmTabsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});