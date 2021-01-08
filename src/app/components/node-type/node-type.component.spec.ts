/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { NodeTypeComponent } from './node-type.component';

let component: NodeTypeComponent;
let fixture: ComponentFixture<NodeTypeComponent>;

describe('nodeType component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ NodeTypeComponent ],
            imports: [ BrowserModule ],
            providers: [ 
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(NodeTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});