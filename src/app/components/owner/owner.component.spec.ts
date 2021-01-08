/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { OwnerComponent } from './owner.component';

let component: OwnerComponent;
let fixture: ComponentFixture<OwnerComponent>;

describe('Owner component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ OwnerComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(OwnerComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});