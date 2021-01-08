/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ExpenditureCategoryComponent } from './expenditure-category.component';

let component: ExpenditureCategoryComponent;
let fixture: ComponentFixture<ExpenditureCategoryComponent>;

describe('ExpenditureCategory component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ExpenditureCategoryComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ExpenditureCategoryComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});