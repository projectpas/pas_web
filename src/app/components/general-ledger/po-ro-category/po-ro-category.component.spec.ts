/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { PoRoCategoryComponent } from './po-ro-category.component';

let component: PoRoCategoryComponent;
let fixture: ComponentFixture<PoRoCategoryComponent>;

describe('po-ro-category component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PoRoCategoryComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(PoRoCategoryComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});