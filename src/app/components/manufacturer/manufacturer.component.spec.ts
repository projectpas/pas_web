/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ManufacturerComponent } from './manufacturer.component';

let component: ManufacturerComponent;
let fixture: ComponentFixture<ManufacturerComponent>;

describe('manufacturer component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ManufacturerComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ManufacturerComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});