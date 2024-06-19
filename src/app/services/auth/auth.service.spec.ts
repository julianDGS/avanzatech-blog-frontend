import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpService } from '../util/http.service';
import { StorageService } from '../util/storage.service';
import { AuthRequest, LoginResponse } from '../../models/auth/login.model';
import { of, throwError } from 'rxjs';
import { User } from '../../models/user/user.model';
import { MessageModel } from '../../models/util/message.model';
import { generateRegisterRequest } from '../../models/user/user.mock';
import { Router, provideRouter } from '@angular/router';

describe('AuthService', () => {
  // let httpController: HttpTestingController;
  // let httpSv: HttpService;
  let service: AuthService;
  let httpSvSpy: jasmine.SpyObj<HttpService>;
  let storageSvSpy: jasmine.SpyObj<StorageService>;
  let router: jasmine.SpyObj<Router>
  let user: User;

  beforeAll(() => {
    user = {
          id: 1,
          name: "some",
          last_name: "user",
          email: "some@mail.com",
          nickname: "someUser",
          team: {
            id: 1,
            name: 'Team 1'
          }
      }
  })

  beforeEach(() => {
    httpSvSpy = jasmine.createSpyObj('HttpService', ['post', 'get']);
    storageSvSpy = jasmine.createSpyObj('StorageService', ['get']);
    TestBed.configureTestingModule({
      providers: [
        // provideHttpClient(),
        // provideHttpClientTesting(),
        // provideToastr(),
        provideRouter([]),
        AuthService,
        {provide: HttpService, useValue: httpSvSpy},
        {provide: StorageService, useValue: storageSvSpy}
      ]
    });
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(router, 'navigateByUrl');
    // httpSv = TestBed.inject(HttpService);
    // httpController = TestBed.inject(HttpTestingController);
  });

  // afterEach(() => {
  //   httpController.verify();
  // })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should login a user', (done) => {
  //   spyOn(httpSv, 'post').and.callThrough();
  //   const mockUserResponse: LoginResponse = {
  //     message: "Successful Login",
  //     user: user
  //   }

  //   service.login({username: user.nickname, password: '12345', confirm_password: '12345'})
  //   .subscribe(resp => {
  //     expect(resp).toBe(mockUserResponse);
  //     expect(httpSv.post).toHaveBeenCalledTimes(1);
  //     done();
  //   })

  //   const req = httpController.expectOne(`${environment.api_url}/user/login/`)
  //   expect(req.request.method).toEqual('POST');
  //   req.flush(mockUserResponse);
  // })

  it('should login a user', (done) => {
    const mockUserResponse: LoginResponse = {
      message: "Successful Login",
      user: user
    }
    httpSvSpy.post.and.returnValue(of(mockUserResponse));

    service.login({username: user.nickname, password: '12345', confirm_password: '12345'})
    .subscribe(resp => {
      expect(resp).toBe(mockUserResponse);
      done();
    })
    expect(httpSvSpy.post).toHaveBeenCalledOnceWith('user/login/', {username: user.nickname, password: '12345', confirm_password: '12345'});
  })

  it('should return error on failed login', (done) => {
    const errorResponse = {error: 'invalid credentials'};
    httpSvSpy.post.and.returnValue(throwError(() => errorResponse));

    service.login({username: 'user', password: '123', confirm_password: '123'})
    .subscribe({
      error: err => {
        expect(err).toBe(errorResponse);
        done();
      }
    })
    expect(httpSvSpy.post).toHaveBeenCalledOnceWith('user/login/', {username: 'user', password: '123', confirm_password: '123'});
  })

  it('should logout a user', (done) => {
    const mockMessage: MessageModel = {
      message: "Successful Logout"
    }
    httpSvSpy.get.and.returnValue(of(mockMessage));

    service.logout()
    .subscribe(resp => {
      expect(resp).toBe(mockMessage);
      done();
    })
    expect(httpSvSpy.get).toHaveBeenCalledOnceWith('user/logout/');
  })

  it('should return error on failed logout', (done) => {
    const errorResponse = {error: 'invalid credentials'};
    httpSvSpy.get.and.returnValue(throwError(() => errorResponse));

    service.logout()
    .subscribe({
      error: err => {
        expect(err).toBe(errorResponse);
        done();
      }
    })
    expect(httpSvSpy.get).toHaveBeenCalledOnceWith('user/logout/');
  })

  it('should register a user', (done) => {
    const mockUserResponse: User = user
    const request: AuthRequest = generateRegisterRequest()
    httpSvSpy.post.and.returnValue(of(mockUserResponse));

    service.register(request)
    .subscribe(resp => {
      expect(resp).toBe(mockUserResponse);
      done();
    })
    expect(httpSvSpy.post).toHaveBeenCalledOnceWith('user/register/', request, false);
  })

  it('should return error on failed login', (done) => {
    const errorResponse = {error: 'invalid credentials'};
    const request: AuthRequest = generateRegisterRequest()
    httpSvSpy.post.and.returnValue(throwError(() => errorResponse));

    service.register(request)
    .subscribe({
      error: err => {
        expect(err).toBe(errorResponse);
        done();
      }
    })
    expect(httpSvSpy.post).toHaveBeenCalledOnceWith('user/register/', request, false);
  })

  it('should cannot activate route when logged user', (done) => {
    storageSvSpy.get.and.returnValue(Promise.resolve({id: user.id, nickname: user.name, teamId: user.team?.id}));
    
    service.isNoAuthAction()
    .then( resp => {
      expect(resp).toBeFalsy()
      expect(storageSvSpy.get).toHaveBeenCalledOnceWith('logged-user');
      expect(router.navigateByUrl).toHaveBeenCalledOnceWith('', {replaceUrl: true});
      done();
    })
  })

  it('should activate route when no logged user', (done) => {
    storageSvSpy.get.and.returnValue(Promise.resolve(null));
    
    service.isNoAuthAction()
    .then( resp => {
      expect(resp).toBeTruthy()
      expect(storageSvSpy.get).toHaveBeenCalledOnceWith('logged-user');
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      done();
    })
  })

});
