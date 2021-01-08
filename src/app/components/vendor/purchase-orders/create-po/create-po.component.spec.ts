/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CreatePoComponent } from './create-po.component';

let component: CreatePoComponent;
let fixture: ComponentFixture<CreatePoComponent>;

describe('create-po component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CreatePoComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CreatePoComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});