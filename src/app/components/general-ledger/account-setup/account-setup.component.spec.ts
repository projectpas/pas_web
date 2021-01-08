/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AccountSetupComponent } from './account-setup.component';

let component: AccountSetupComponent;
let fixture: ComponentFixture<AccountSetupComponent>;

describe('AccountSetup component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AccountSetupComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AccountSetupComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});