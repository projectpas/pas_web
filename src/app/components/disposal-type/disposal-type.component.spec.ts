/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { DisposalTypeComponent } from './disposal-type.component';

let component: DisposalTypeComponent;
let fixture: ComponentFixture<DisposalTypeComponent>;

describe('DisposalType component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DisposalTypeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(DisposalTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});