/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { DefaultMessageComponent } from './default-message.component';

let component: DefaultMessageComponent;
let fixture: ComponentFixture<DefaultMessageComponent>;

describe('default-message component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DefaultMessageComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(DefaultMessageComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});