import { TestBed } from '@angular/core/testing';

import { LikeService } from './like.service';
import { HttpService } from '../util/http.service';
import { generateOneLike, generatePaginatedLike } from '../../models/like/like.mock';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideToastr } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

describe('LikeService', () => {
  let service: LikeService;
  let httpController: HttpTestingController;
  let httpSv: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
        HttpService,
      ]
    });
    service = TestBed.inject(LikeService);
    httpSv = TestBed.inject(HttpService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http service to create a like', (doneFn) => {
    const mockPostId = 1;
    const mockLike = generateOneLike()
    spyOn(httpSv, 'post').and.callThrough();

    service.createLike(mockPostId)
    .subscribe(resp => {
      expect(resp).toBe(mockLike);
      expect(httpSv.post).toHaveBeenCalledOnceWith('like/', {post_id: mockPostId});
      doneFn();
    })

    const req = httpController.expectOne(`${environment.api_url}/like/`)
    expect(req.request.method).toEqual('POST');
    req.flush(mockLike);
  })

  it('should return error on failed like creation', (done) => {
    const errorResponse = {error: 'invalid credentials'};
    spyOn(httpSv, 'post').and.callThrough()

    service.createLike(1)
    .subscribe({
      error: err => {
        expect(err).toBe(errorResponse);
        expect(httpSv.post).toHaveBeenCalledOnceWith('like/', {post_id: 1});
        done();
      }
    })

    const req = httpController.expectOne(`${environment.api_url}/like/`)
    expect(req.request.method).toEqual('POST');
    req.flush(errorResponse, {status: 404, statusText: 'Not Found'});
  })

  it('should call http service to get paginated likes', (done) => {
    const mockPostId = '1';
    const mockPageNumber = '1';
    const url = `like/?page=${mockPageNumber}&post=${mockPostId}&user=`
    const mockPagLike = generatePaginatedLike()
    spyOn(httpSv, 'get').and.callThrough();

    service.getLikes(mockPageNumber, mockPostId)
    .subscribe(resp => {
      expect(resp.results.length).toEqual(mockPagLike.results.length);
      expect(httpSv.get).toHaveBeenCalledOnceWith(url);
      done();
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`);
    req.flush(mockPagLike);
    // const params = req.request.params;
    // expect(params.get('page')).toEqual(`${mockPostId}`);
    // expect(params.get('post')).toEqual(`${mockPageNumber}`);
  })

  it('should call http service to delete a like', (doneFn) => {
    const mockPostId = 1;
    const url = `like/${mockPostId}/`
    spyOn(httpSv, 'delete').and.callThrough();

    service.deleteLike(mockPostId)
    .subscribe(() => {
      expect(httpSv.delete).toHaveBeenCalledOnceWith(url);
      doneFn();
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`)
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  })

  it('should return error on fail like deletion', (done) => {
    const errorResponse = {error: 'invalid credentials'};
    const url = 'like/1/'
    spyOn(httpSv, 'delete').and.callThrough()

    service.deleteLike(1)
    .subscribe({
      error: err => {
        expect(err).toBe(errorResponse);
        expect(httpSv.delete).toHaveBeenCalledOnceWith(url);
        done();
      }
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`)
    expect(req.request.method).toEqual('DELETE');
    req.flush(errorResponse, {status: 404, statusText: 'Not Found'});
  })

})
