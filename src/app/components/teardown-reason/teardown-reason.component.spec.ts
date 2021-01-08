/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { TeardownReasonComponent } from './teardown-reason.component';

let component: TeardownReasonComponent;
let fixture: ComponentFixture<TeardownReasonComponent>;

describe('teardown-reason component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ TeardownReasonComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(TeardownReasonComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});