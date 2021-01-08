/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ViewPoComponent } from './view-po.component';

let component: ViewPoComponent;
let fixture: ComponentFixture<ViewPoComponent>;

describe('edit-po component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ViewPoComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ViewPoComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});