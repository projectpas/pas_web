/// <reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CreateJournelComponent } from './create-journel.component';

let component: CreateJournelComponent;
let fixture: ComponentFixture<CreateJournelComponent>;

describe('create-journel component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CreateJournelComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CreateJournelComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});