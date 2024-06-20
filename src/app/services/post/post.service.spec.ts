import { TestBed } from '@angular/core/testing';

import { PostService } from './post.service';
import { generateOnePost, generatePaginatedPost, generatePostRequest, generatePostResponse } from '../../models/post/post.mock';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideToastr } from 'ngx-toastr';
import { HttpService } from '../util/http.service';

describe('PostService', () => {
  let service: PostService;
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
    service = TestBed.inject(PostService);
    httpSv = TestBed.inject(HttpService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http service to create a post', (doneFn) => {
    const mockPost = generateOnePost()
    const mockPostRequest = generatePostRequest(mockPost)
    const mockResponse = generatePostResponse(mockPost);
    spyOn(httpSv, 'post').and.callThrough();

    service.createPost(mockPostRequest)
    .subscribe(resp => {
      expect(resp).toEqual(mockResponse);
      expect(httpSv.post).toHaveBeenCalledOnceWith('post/', mockPostRequest);
      doneFn();
    })

    const req = httpController.expectOne(`${environment.api_url}/post/`)
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  })

  it('should return error when post creation fails', (done) => {
    const errorResponse = {error: 'error'};
    const mockPost = generateOnePost()
    const mockPostRequest = generatePostRequest(mockPost)
    spyOn(httpSv, 'post').and.callThrough()

    service.createPost(mockPostRequest)
    .subscribe({
      error: err => {
        expect(err).toBe(errorResponse);
        expect(httpSv.post).toHaveBeenCalledOnceWith('post/', mockPostRequest);
        done();
      }
    })

    const req = httpController.expectOne(`${environment.api_url}/post/`)
    expect(req.request.method).toEqual('POST');
    req.flush(errorResponse, {status: 404, statusText: 'Not Found'});
  })

  it('should call http service to get paginated and filter posts', (done) => {
    const titleParam = '1';
    const page = '1';
    const url = `post/?page=${page}&title=${titleParam}`
    const mockPagPost = generatePaginatedPost()
    spyOn(httpSv, 'get').and.callThrough();

    service.listPosts(page, titleParam)
    .subscribe(resp => {
      expect(resp.results.length).toEqual(mockPagPost.results.length);
      expect(httpSv.get).toHaveBeenCalledOnceWith(url);
      done();
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockPagPost);
    // const params = req.request.params;
    // expect(params.get('page')).toEqual(`${mockPostId}`);
    // expect(params.get('post')).toEqual(`${mockPageNumber}`);
  })

  it('should call http service to get paginated and no filter', (done) => {
    const page = '1';
    const url = `post/?page=${page}`
    const mockPagPost = generatePaginatedPost()
    spyOn(httpSv, 'get').and.callThrough();

    service.listPosts(page)
    .subscribe(resp => {
      expect(resp.results.length).toEqual(mockPagPost.results.length);
      expect(httpSv.get).toHaveBeenCalledOnceWith(url);
      done();
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockPagPost);
    // const params = req.request.params;
    // expect(params.get('page')).toEqual(`${mockPostId}`);
    // expect(params.get('post')).toEqual(`${mockPageNumber}`);
  })

  it('should call http service to get filter posts without page number', (done) => {
    const titleParam = '1';
    const url = `post/?title=${titleParam}`
    const mockPagPost = generatePaginatedPost()
    spyOn(httpSv, 'get').and.callThrough();

    service.listPosts(undefined, titleParam)
    .subscribe(resp => {
      expect(resp.results.length).toEqual(mockPagPost.results.length);
      expect(httpSv.get).toHaveBeenCalledOnceWith(url);
      done();
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockPagPost);
    // const params = req.request.params;
    // expect(params.get('page')).toEqual(`${mockPostId}`);
    // expect(params.get('post')).toEqual(`${mockPageNumber}`);
  })


  it('should call http service without page number to get posts', (done) => {
    const url = `post/`
    const mockPagPost = generatePaginatedPost()
    spyOn(httpSv, 'get').and.callThrough();

    service.listPosts()
    .subscribe(resp => {
      expect(resp.results.length).toEqual(mockPagPost.results.length);
      expect(httpSv.get).toHaveBeenCalledOnceWith(url);
      done();
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockPagPost);
    // const params = req.request.params;
    // expect(params.get('page')).toEqual(`${mockPostId}`);
    // expect(params.get('post')).toEqual(`${mockPageNumber}`);
  })

  it('should return error when post list fails', (done) => {
    const errorResponse = {error: 'error'};
    spyOn(httpSv, 'get').and.callThrough()

    service.listPosts()
    .subscribe({
      error: err => {
        expect(err).toBe(errorResponse);
        expect(httpSv.get).toHaveBeenCalledOnceWith('post/');
        done();
      }
    })

    const req = httpController.expectOne(`${environment.api_url}/post/`)
    expect(req.request.method).toEqual('GET');
    req.flush(errorResponse, {status: 404, statusText: 'Not Found'});
  })

  it('should call http service to get a single post', (doneFn) => {
    const mockPostId = 1;
    const url = `post/${mockPostId}/`
    spyOn(httpSv, 'get').and.callThrough();

    service.getPost(mockPostId)
    .subscribe(() => {
      expect(httpSv.get).toHaveBeenCalledOnceWith(url);
      doneFn();
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`)
    expect(req.request.method).toEqual('GET');
    req.flush({});
  })

  it('should return error when get post fails', (done) => {
    const errorResponse = {error: 'error'};
    const mockPostId = 1;
    const url = `post/${mockPostId}/`
    spyOn(httpSv, 'get').and.callThrough()

    service.getPost(mockPostId)
    .subscribe({
      error: err => {
        expect(err).toBe(errorResponse);
        expect(httpSv.get).toHaveBeenCalledOnceWith(url);
        done();
      }
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`)
    expect(req.request.method).toEqual('GET');
    req.flush(errorResponse, {status: 404, statusText: 'Not Found'});
  })

  it('should call http service to update a post', (doneFn) => {
    const mockPost = generateOnePost()
    const mockPostRequest = generatePostRequest(mockPost);
    mockPostRequest.title = 'other';
    const mockResponse = generatePostResponse(mockPost);
    mockResponse.title = 'other';
    const url = `post/${mockPost.id}/`
    spyOn(httpSv, 'put').and.callThrough();

    service.updatePost(mockPost.id, mockPostRequest)
    .subscribe((resp) => {
      expect(resp).toEqual(mockResponse);
      expect(httpSv.put).toHaveBeenCalledOnceWith(url, mockPostRequest);
      doneFn();
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`)
    expect(req.request.method).toEqual('PUT');
    req.flush(mockResponse);
  })

  it('should return error when update post fails', (done) => {
    const errorResponse = {error: 'error'};
    const mockPost = generateOnePost()
    const mockPostRequest = generatePostRequest(mockPost);
    const url = `post/${mockPost.id}/`
    spyOn(httpSv, 'put').and.callThrough()

    service.updatePost(mockPost.id, mockPostRequest)
    .subscribe({
      error: err => {
        expect(err).toBe(errorResponse);
        expect(httpSv.put).toHaveBeenCalledOnceWith(url, mockPostRequest);
        done();
      }
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`)
    expect(req.request.method).toEqual('PUT');
    req.flush(errorResponse, {status: 404, statusText: 'Not Found'});
  })

  it('should call http service to delete post', (doneFn) => {
    const mockPostId = 1;
    const url = `post/${mockPostId}/`
    spyOn(httpSv, 'delete').and.callThrough();

    service.deletePost(mockPostId)
    .subscribe(() => {
      expect(httpSv.delete).toHaveBeenCalledOnceWith(url);
      doneFn();
    })

    const req = httpController.expectOne(`${environment.api_url}/${url}`)
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  })

  it('should return error when delete post fails', (done) => {
    const errorResponse = {error: 'error'};
    const mockPostId = 1;
    const url = `post/${mockPostId}/`
    spyOn(httpSv, 'delete').and.callThrough()

    service.deletePost(mockPostId)
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


});
