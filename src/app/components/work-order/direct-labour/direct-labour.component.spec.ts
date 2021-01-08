/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { DirectLabourComponent } from './direct-labour.component';

let component: DirectLabourComponent;
let fixture: ComponentFixture<DirectLabourComponent>;

describe('Direct-labour component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DirectLabourComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(DirectLabourComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});