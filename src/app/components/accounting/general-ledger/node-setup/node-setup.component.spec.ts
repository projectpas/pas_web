/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { NodeSetupComponent } from './node-setup.component';

let component: NodeSetupComponent;
let fixture: ComponentFixture<NodeSetupComponent>;

describe('node-setup component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ NodeSetupComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(NodeSetupComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});