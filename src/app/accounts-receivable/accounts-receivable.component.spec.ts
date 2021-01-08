/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AccountsReceivableComponent } from './accounts-receivable.component';

let component: AccountsReceivableComponent;
let fixture: ComponentFixture<AccountsReceivableComponent>;

describe('accountsReceivable component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AccountsReceivableComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AccountsReceivableComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});