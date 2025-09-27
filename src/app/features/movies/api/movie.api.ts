import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieResponse } from '../types/movie.type';
import { HttpClient} from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MovieApiService {
  private http = inject(HttpClient);
  private readonly apiKey = environment.apiKey;
  private readonly apiUrl = 'https://api.themoviedb.org/3';

  private buildUrl(path: string, params: Record<string, any> = {}): string {
    const stringParams: Record<string, string> = {
      api_key: String(this.apiKey),
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    };
    const query = new URLSearchParams(stringParams).toString();
    return `${this.apiUrl}${path}?${query}`;
  }

  getPopularMovies(page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(this.buildUrl('/movie/popular', { page }));
  }

  searchMovies(query: string, page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(this.buildUrl('/search/movie', { query, page }));
  }

  getGenres(): Observable<{ id: number; name: string }[]> {
    return this.http
      .get<{ genres: { id: number; name: string }[] }>(this.buildUrl('/genre/movie/list'))
      .pipe(map(r => r.genres));
  }

  getMovieDetails(id: number): Observable<any> {
    return this.http.get<any>(this.buildUrl(`/movie/${id}`));
  }

  searchPerson(query: string): Observable<any> {
    return this.http.get(this.buildUrl('/search/person', { query: encodeURIComponent(query) }));
  }

  getPersonMovies(personId: number): Observable<any> {
    return this.http.get(this.buildUrl(`/person/${personId}/movie_credits`));
  }
}

