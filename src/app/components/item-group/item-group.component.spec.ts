/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ItemGroupComponent } from './item-group.component';

let component: ItemGroupComponent;
let fixture: ComponentFixture<ItemGroupComponent>;

describe('ItemGroup component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ItemGroupComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ItemGroupComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});