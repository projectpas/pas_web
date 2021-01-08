/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ItemClassificationComponent } from './item-classification.component';

let component: ItemClassificationComponent;
let fixture: ComponentFixture<ItemClassificationComponent>;

describe('ItemClassification component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ItemClassificationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ItemClassificationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});