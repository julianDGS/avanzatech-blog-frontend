import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { ToastrService } from 'ngx-toastr';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { generateOneUser } from '../../../models/user/user.mock';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthRequest } from '../../../models/auth/login.model';
import { User } from '../../../models/user/user.model';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authSvSpy: jasmine.SpyObj<AuthService>;
  let toastrSvSpy: jasmine.SpyObj<ToastrService>;
  let routerStub: jasmine.SpyObj<Router>;
  let user: User;
  let userRegister: AuthRequest;

  beforeAll(() => {
    user = generateOneUser()
    userRegister = {
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      password: '12345',
      confirm_password: '12345',
    };
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        provideAnimations(),
        {provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['register'])},
        {provide: ToastrService, useValue: jasmine.createSpyObj('messageSV', ['success'])}
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterComponent);
    routerStub = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastrSvSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    authSvSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    spyOn(routerStub, 'navigate');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register service method', () => {
    authSvSpy.register.and.returnValue(of(user));
    const authComponent = fixture.debugElement.query(By.css('app-auth-form'))
    authComponent.triggerEventHandler('formData', userRegister);
    fixture.detectChanges();
    expect(authSvSpy.register).toHaveBeenCalledOnceWith(userRegister);
    expect(toastrSvSpy.success).toHaveBeenCalledOnceWith('User created', 'Success', {progressBar: true});
    expect(routerStub.navigate).toHaveBeenCalledOnceWith(['auth']);
  });

  it('should not navigate if request failed', () => {
    authSvSpy.register.and.returnValue(throwError(() => 'error'))
    const authComponent = fixture.debugElement.query(By.css('app-auth-form'))
    authComponent.triggerEventHandler('formData', userRegister);
    fixture.detectChanges();
    expect(authSvSpy.register).toHaveBeenCalledOnceWith(userRegister);
    expect(toastrSvSpy.success).not.toHaveBeenCalled();
    expect(routerStub.navigate).not.toHaveBeenCalled();
  });
});
