/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { PlatformComponent } from './platform.component';

let component: PlatformComponent;
let fixture: ComponentFixture<PlatformComponent>;

describe('Platform component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PlatformComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(PlatformComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});