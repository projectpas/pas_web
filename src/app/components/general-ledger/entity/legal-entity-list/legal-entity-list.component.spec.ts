/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { EntityEditComponent } from './legal-entity-list.component';

let component: EntityEditComponent;
let fixture: ComponentFixture<EntityEditComponent>;

describe('EntityEdit component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EntityEditComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(EntityEditComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});