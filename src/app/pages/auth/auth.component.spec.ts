import { ComponentFixture, TestBed } from '@angular/core/testing';

import AuthComponent from './auth.component';
import { ActivatedRoute } from '@angular/router';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthComponent],
      providers: [
        {provide: ActivatedRoute, useValue: jasmine.createSpyObj('activeRoute', [], {params: {}})}
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
