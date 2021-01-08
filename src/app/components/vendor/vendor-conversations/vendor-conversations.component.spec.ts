/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorConversationsComponent } from './vendor-conversations.component';

let component: VendorConversationsComponent;
let fixture: ComponentFixture<VendorConversationsComponent>;

describe('VendorConversations component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorConversationsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorConversationsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});