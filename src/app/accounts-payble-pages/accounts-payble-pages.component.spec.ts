/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AccountsPayblePagesComponent } from './accounts-payble-pages.component';

let component: AccountsPayblePagesComponent;
let fixture: ComponentFixture<AccountsPayblePagesComponent>;

describe('accountsPayblePages component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AccountsPayblePagesComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AccountsPayblePagesComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});