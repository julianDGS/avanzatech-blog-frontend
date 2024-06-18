import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AuthService } from '../../../services/auth/auth.service';
import { StorageService } from '../../../services/util/storage.service';
import { Router, provideRouter } from '@angular/router';
import { generateOneUser } from '../../../models/user/user.mock';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSvSpy: jasmine.SpyObj<AuthService>;
  let storageSvSpy: jasmine.SpyObj<StorageService>;
  let routerStub: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideAnimations(),
        {provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['login'])},
        {provide: StorageService, useValue: jasmine.createSpyObj('StorageService', ['set'])},
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    routerStub = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    storageSvSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    authSvSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    spyOn(routerStub, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login service method and call storage service', () => {
    const user = generateOneUser();
    authSvSpy.login.and.returnValue(of({user, message: 'Succesfully login'}));
    const authComponent = fixture.debugElement.query(By.css('app-auth-form'))
    authComponent.triggerEventHandler('formData', {password: '12345', username: 'user1'});
    fixture.detectChanges();
    expect(authSvSpy.login).toHaveBeenCalledOnceWith({password: '12345', username: 'user1'});
    expect(storageSvSpy.set).toHaveBeenCalledOnceWith('logged-user', {id: user.id, nickname: user.name, teamId: user.team?.id});
    expect(routerStub.navigate).toHaveBeenCalledTimes(1);
  });

  it('should not call storage service or navigate if request failed', () => {
    authSvSpy.login.and.returnValue(throwError(() => 'error'))
    const authComponent = fixture.debugElement.query(By.css('app-auth-form'))
    authComponent.triggerEventHandler('formData', {password: '12345', username: 'user1'});
    fixture.detectChanges();
    expect(authSvSpy.login).toHaveBeenCalledOnceWith({password: '12345', username: 'user1'});
    expect(storageSvSpy.set).not.toHaveBeenCalled();
    expect(routerStub.navigate).not.toHaveBeenCalled();
  });

});
