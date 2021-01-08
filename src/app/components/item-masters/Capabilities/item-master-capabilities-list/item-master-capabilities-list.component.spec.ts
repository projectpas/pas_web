/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ItemMasterCapabilitiesListComponent } from './item-master-capabilities-list.component';

let component: ItemMasterCapabilitiesListComponent;
let fixture: ComponentFixture<ItemMasterCapabilitiesListComponent>;

describe('item-master-capabilities-list component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ItemMasterCapabilitiesListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ItemMasterCapabilitiesListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});