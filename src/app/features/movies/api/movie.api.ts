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

  getPopularMovies(page = 1): Observable<MovieResponse> {
    console.log(this.apiKey)
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`);
  }

  searchMovies(query: string, page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${query}&page=${page}`);
  }

  getGenres(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ genres: { id: number; name: string }[] }>(`${this.apiUrl}/genre/movie/list?api_key=${this.apiKey}`)
      .pipe(map(response => response.genres));
  }

  getMovieDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`);
  }

  searchPerson(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/person?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`);
    }


  getPersonMovies(personId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/person/${personId}/movie_credits?api_key=${this.apiKey}`);
  }
  
}

