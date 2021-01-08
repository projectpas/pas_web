/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { IntegrationComponent } from './integration.component';

let component: IntegrationComponent;
let fixture: ComponentFixture<IntegrationComponent>;

describe('Integration component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ IntegrationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(IntegrationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});