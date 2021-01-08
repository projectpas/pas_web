/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { RolesListComponent } from './roles-list.component';

let component: RolesListComponent;
let fixture: ComponentFixture<RolesListComponent>;

describe('roles-list component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RolesListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(RolesListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});