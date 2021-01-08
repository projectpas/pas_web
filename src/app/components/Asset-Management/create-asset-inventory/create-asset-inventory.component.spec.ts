/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CreateAssetInventoryComponent } from './create-asset-inventory.component';

let component: CreateAssetInventoryComponent;
let fixture: ComponentFixture<CreateAssetInventoryComponent>;

describe('create-asset-inventory component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateAssetInventoryComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CreateAssetInventoryComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});