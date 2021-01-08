/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { OpportunityListComponent } from './opportunity-list.component';

let component: OpportunityListComponent;
let fixture: ComponentFixture<OpportunityListComponent>;

describe('OpportunityList component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ OpportunityListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(OpportunityListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});