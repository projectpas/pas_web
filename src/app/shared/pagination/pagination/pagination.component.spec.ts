/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { PaginationComponent } from './pagination.component';

let component: PaginationComponent;
let fixture: ComponentFixture<PaginationComponent>;

describe('pagination component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PaginationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(PaginationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});