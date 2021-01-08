/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AtaMainComponent } from './ata-main.component';

let component: AtaMainComponent;
let fixture: ComponentFixture<AtaMainComponent>;

describe('AtaMain component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AtaMainComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AtaMainComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});