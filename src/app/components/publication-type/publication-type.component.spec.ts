/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { PublicationTypeComponent } from './publication-type.component';

let component: PublicationTypeComponent;
let fixture: ComponentFixture<PublicationTypeComponent>;

describe('publication-type component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PublicationTypeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(PublicationTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});