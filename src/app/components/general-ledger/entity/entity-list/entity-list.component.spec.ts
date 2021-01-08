/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { LegalEntityStructureComponent } from './entity-list.component';


let component: LegalEntityStructureComponent;
let fixture: ComponentFixture<LegalEntityStructureComponent>;

describe('EntityList component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
			declarations: [LegalEntityStructureComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
		fixture = TestBed.createComponent(LegalEntityStructureComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});