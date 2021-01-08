/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AtaSubChapter1Component } from './ata-sub-chapter1.component';

let component: AtaSubChapter1Component;
let fixture: ComponentFixture<AtaSubChapter1Component>;

describe('AtaSubChapter1 component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AtaSubChapter1Component ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AtaSubChapter1Component);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});