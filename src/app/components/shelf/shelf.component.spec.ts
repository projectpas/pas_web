/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ShelfComponent } from './shelf.component';

let component: ShelfComponent;
let fixture: ComponentFixture<ShelfComponent>;

describe('shelf component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ShelfComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ShelfComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});