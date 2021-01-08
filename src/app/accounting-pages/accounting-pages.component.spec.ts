/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AccountingPagesComponent } from './accounting-pages.component';

let component: AccountingPagesComponent;
let fixture: ComponentFixture<AccountingPagesComponent>;

describe('AccountingPages component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AccountingPagesComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AccountingPagesComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});