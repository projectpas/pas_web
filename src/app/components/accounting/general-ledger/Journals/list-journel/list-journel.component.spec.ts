/// <reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ListJournelComponent } from './list-journel.component';

let component: ListJournelComponent;
let fixture: ComponentFixture<ListJournelComponent>;

describe('list-journel component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ListJournelComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ListJournelComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});