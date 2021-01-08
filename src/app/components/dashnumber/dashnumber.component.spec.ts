/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { DashnumberComponent } from './dashnumber.component';

let component: DashnumberComponent;
let fixture: ComponentFixture<DashnumberComponent>;

describe('dashnumber component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DashnumberComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(DashnumberComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});