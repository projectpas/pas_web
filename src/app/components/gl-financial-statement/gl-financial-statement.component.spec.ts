/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { GlFinancialStatementComponent } from './gl-financial-statement.component';

let component: GlFinancialStatementComponent;
let fixture: ComponentFixture<GlFinancialStatementComponent>;

describe('GlFinancialStatement component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ GlFinancialStatementComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(GlFinancialStatementComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});