/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { PoApprovalComponent } from './po-approval.component';

let component: PoApprovalComponent;
let fixture: ComponentFixture<PoApprovalComponent>;

describe('po-approval component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PoApprovalComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(PoApprovalComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});