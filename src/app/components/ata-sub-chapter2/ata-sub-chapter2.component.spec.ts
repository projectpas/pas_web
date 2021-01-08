/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AtaSubChapter2Component } from './ata-sub-chapter2.component';

let component: AtaSubChapter2Component;
let fixture: ComponentFixture<AtaSubChapter2Component>;

describe('AtaSubChapter2 component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AtaSubChapter2Component ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AtaSubChapter2Component);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});