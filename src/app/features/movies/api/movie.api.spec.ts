import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieApiService } from './movie.api';
import { MovieResponse } from '../types/movie.type';

describe('MovieApiService', () => {
  let service: MovieApiService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieApiService]
    });
    service = TestBed.inject(MovieApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch popular movies', () => {
    const dummyResponse: MovieResponse = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0
    };

    service.getPopularMovies().subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(req => req.url.includes('/movie/popular'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should search movies', () => {
    const dummyResponse: MovieResponse = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0
    };
    const query = 'Inception';

    service.searchMovies(query).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    
    const req = httpMock.expectOne(req => req.url.includes('/search/movie') && req.url.includes(`query=${query}`));
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  
});
