/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ManagementStructureComponent } from './entity-setup.component';


let component: ManagementStructureComponent;
let fixture: ComponentFixture<ManagementStructureComponent>;

describe('EntitySetup component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
			declarations: [ManagementStructureComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
		fixture = TestBed.createComponent(ManagementStructureComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});