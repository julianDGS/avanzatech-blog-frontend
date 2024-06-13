import { TestBed } from '@angular/core/testing';

import { HttpService } from './http.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import {  ToastrService, provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { credentialInterceptor, credentialToken } from '../../interceptors/credential.interceptor';


fdescribe('HttpService', () => {
  let service: HttpService;
  let httpController: HttpTestingController;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  const url = 'test-url';

  beforeEach(() => {
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([credentialInterceptor])),
        provideHttpClientTesting(),
        provideToastr(),
        {provide: ToastrService, useValue: toastrSpy},     
        HttpService,
      ]
    });
    service = TestBed.inject(HttpService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle connection error', () => {
    service.get(url).subscribe({error: err => {
      expect(err).toEqual('Failed to connect with server')
    }})
    const req = httpController.expectOne(`${environment.api_url}/${url}`)
    req.flush('Failed to connect with server', {status: 0, statusText: 'No connection available'})
  })

  describe('GET method tests', () => {
    it('should make a get request to the API url with credentials', () => {
        service.get(url).subscribe();
        const req = httpController.expectOne(`${environment.api_url}/${url}`);
        expect(req.request.method).toEqual('GET');
        expect(req.request.context.get(credentialToken())).toBeTruthy()
        expect(req.request.withCredentials).toBeTruthy()
        req.flush({});
    });
  
    it('should make a get request to the API url without credentials', () => {
      service.get(url, false).subscribe();
      const req = httpController.expectOne(`${environment.api_url}/${url}`);
      expect(req.request.method).toEqual('GET');
      expect(req.request.context.get(credentialToken())).toBeFalsy()
      expect(req.request.withCredentials).toBeFalsy()
      req.flush({});
    });
  
    it('should make a get request to the API and handle errors', () => {
      const errorMessage = 'test 404 error';
      
      service.get(url).subscribe({error: err => {
        expect(err.detail).toEqual(errorMessage);
        }});
        
      const req = httpController.expectOne(`${environment.api_url}/${url}`);
      expect(req.request.method).toEqual('GET');
      req.flush({detail: errorMessage}, { status: 404, statusText: 'Not Found'});
      expect(toastrSpy.error).toHaveBeenCalledWith(errorMessage, 'Error', {
        timeOut: 10000,
        extendedTimeOut: 5000,
        progressBar: true
      });
    });
  })

  describe('POST method', () => {
    it('should make a post request to the API url with credentials and x-csrftoken', () => {
        document.cookie = 'csrftoken=fake-csrf-id';
        service.post<{id: number}>(url, {}).subscribe();
        const req = httpController.expectOne(`${environment.api_url}/${url}`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.context.get(credentialToken())).toBeTruthy()
        expect(req.request.withCredentials).toBeTruthy()
        expect(req.request.headers.has('X-CSRFToken')).toBeTruthy()
        req.flush({});
        document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
  
    it('should make a post request to the API url without credentials', () => {
      service.post(url, {}, false).subscribe();
      const req = httpController.expectOne(`${environment.api_url}/${url}`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.context.get(credentialToken())).toBeFalsy()
      expect(req.request.withCredentials).toBeFalsy()
      expect(req.request.headers.has('X-CSRFToken')).toBeFalsy()
      req.flush({});
    });
  
    it('should make a post request to the API and handle errors', () => {
      const errorMessage = 'test 400 error';
      service.post(url, {}).subscribe({error: err => {
        expect(err.name[0]).toEqual(errorMessage);
        }});
      const req = httpController.expectOne(`${environment.api_url}/${url}`);
      expect(req.request.method).toEqual('POST');
      req.flush({name: [errorMessage]}, { status: 400, statusText: 'Bad Request'});
      
      expect(toastrSpy.error).toHaveBeenCalledWith(`name: ${errorMessage}\n`, 'Error', {
        timeOut: 10000,
        extendedTimeOut: 5000,
        progressBar: true
      });
    });
  })

  describe('PUT method tests', () => {  
    it('should make a put request to the API url with credentials and x-csrftoken', () => {
      document.cookie = 'csrftoken=fake-csrf-id';
      service.put(url, {}).subscribe();
      const req = httpController.expectOne(`${environment.api_url}/${url}`);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.context.get(credentialToken())).toBeTruthy()
      expect(req.request.withCredentials).toBeTruthy()
      expect(req.request.headers.has('X-CSRFToken')).toBeTruthy()
      req.flush({});
      document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
  
    it('should make a put request to the API url without credentials', () => {
      service.put(url, {}, false).subscribe();
      const req = httpController.expectOne(`${environment.api_url}/${url}`);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.context.get(credentialToken())).toBeFalsy()
      expect(req.request.withCredentials).toBeFalsy()
      req.flush({});
    });
  
    it('should make a put request to the API and handle errors', () => {
      const errorMessage = 'test 500 error';
      
      service.put(url, {}).subscribe({error: err => {
        expect(err.error).toEqual(errorMessage);
      }});
        
      const req = httpController.expectOne(`${environment.api_url}/${url}`);
      expect(req.request.method).toEqual('PUT');
      req.flush({error: errorMessage}, { status: 500, statusText: 'Internal Server Error'});
      expect(toastrSpy.error).toHaveBeenCalledWith(errorMessage, 'Error', {
        timeOut: 10000,
        extendedTimeOut: 5000,
        progressBar: true
      });
    });
  })

  describe('PATCH method tests', () => {
    it('should make a patch request to the API url with credentials and x-csrftoken', () => {
      document.cookie = 'csrftoken=fake-csrf-id';
      service.patch(url, {}).subscribe();
      const req = httpController.expectOne(`${environment.api_url}/${url}`);
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.context.get(credentialToken())).toBeTruthy()
      expect(req.request.withCredentials).toBeTruthy()
      expect(req.request.headers.has('X-CSRFToken')).toBeTruthy()
      req.flush({});
      document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
  
    it('should make a patch request to the API url without credentials', () => {
      service.patch(url, {}, false).subscribe();
      const req = httpController.expectOne(`${environment.api_url}/${url}`);
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.context.get(credentialToken())).toBeFalsy()
      expect(req.request.withCredentials).toBeFalsy()
      req.flush({});
    });
  
    it('should make a patch request to the API and handle errors', () => {
      const errorMessage = 'test 405 error';
      
      service.patch(url, {}).subscribe({error: err => {
        expect(err.message).toEqual(errorMessage);
      }});
        
      const req = httpController.expectOne(`${environment.api_url}/${url}`);
      expect(req.request.method).toEqual('PATCH');
      req.flush({message: errorMessage}, { status: 405, statusText: 'Method Not Allowed'});
      expect(toastrSpy.error).toHaveBeenCalledWith(errorMessage, 'Error', {
        timeOut: 10000,
        extendedTimeOut: 5000,
        progressBar: true
      });
    });
  })

  describe('DELETE method tests', () => {
    it('should make a delete request to the API url with credentials and x-csrftoken', () => {
      document.cookie = 'csrftoken=fake-csrf-id';
      service.delete(url).subscribe();
      const req = httpController.expectOne(`${environment.api_url}/${url}`);
      expect(req.request.method).toEqual('DELETE');
      expect(req.request.context.get(credentialToken())).toBeTruthy()
      expect(req.request.withCredentials).toBeTruthy()
      expect(req.request.headers.has('X-CSRFToken')).toBeTruthy()
      req.flush({});
      document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
  
    it('should make a delete request to the API url without credentials', () => {
      service.delete(url, false).subscribe();
      const req = httpController.expectOne(`${environment.api_url}/${url}`);
      expect(req.request.method).toEqual('DELETE');
      expect(req.request.context.get(credentialToken())).toBeFalsy()
      expect(req.request.withCredentials).toBeFalsy()
      req.flush({});
    });
  
    it('should make a delete request to the API and handle errors', () => {
      const errorMessage = 'test 404 error';
      
      service.delete(url).subscribe({error: err => {
        expect(err.detail).toEqual(errorMessage);
        }});
        
      const req = httpController.expectOne(`${environment.api_url}/${url}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush({detail: errorMessage}, { status: 404, statusText: 'Not Found'});
      expect(toastrSpy.error).toHaveBeenCalledWith(errorMessage, 'Error', {
        timeOut: 10000,
        extendedTimeOut: 5000,
        progressBar: true
      });
    });
  })


});
