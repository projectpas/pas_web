/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { JournalApprovalsComponent } from './journal-approvals.component';

let component: JournalApprovalsComponent;
let fixture: ComponentFixture<JournalApprovalsComponent>;

describe('JournalApprovals component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ JournalApprovalsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(JournalApprovalsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});