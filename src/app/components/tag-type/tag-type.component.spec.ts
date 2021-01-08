/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { TagTypeComponent } from './tag-type.component';

let component: TagTypeComponent;
let fixture: ComponentFixture<TagTypeComponent>;

describe('TagType component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ TagTypeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(TagTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});