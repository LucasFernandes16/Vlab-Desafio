import { Injectable, inject } from '@angular/core';
import { MovieApiService } from '../api/movie.api';
import { MovieStateService } from '../state/movie.state';
import { map, tap, catchError,switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Movie } from '../types/movie.type';
import { MovieResponse } from '../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class MovieFacade {
  public api = inject(MovieApiService);
  private state = inject(MovieStateService);

  movies$ = this.state.movies$;
  loading$ = this.movies$.pipe(map(s => s.loading));
  error$ = this.movies$.pipe(map(s => s.error));

  private fetch(stream$: Observable<MovieResponse>) {
    this.state.setLoading(true);
    stream$.pipe(
      tap(res => {
        if (res) {
          this.state.setMovies(res.results);
          this.state.setPagination(res.page, res.total_pages);
        }
        this.state.setLoading(false);
      }),
      catchError(() => {
        this.state.setError('Falha ao carregar filmes');
        this.state.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  loadPopularMovies(page = 1) {
    this.fetch(this.api.getPopularMovies(page));
  }

  searchMovies(query: string, page = 1) {
    if (!query.trim()) {
      this.loadPopularMovies();
      return;
    }
    this.fetch(this.api.searchMovies(query, page));
  }

  getMovieDetails(movieId: number): Observable<Movie> {
    return this.api.getMovieDetails(movieId);
  }

  searchMoviesByPerson(name: string, job: 'Actor' | 'Director' | 'Writer' = 'Actor') {
    return this.api.searchPerson(name).pipe(
      switchMap((res: any) => {
        if (!res.results?.length) return of([]);
        const personId = res.results[0].id;
        return this.api.getPersonMovies(personId).pipe(
          map((credits: any) => {
            const crew = credits.crew || [];
            switch (job) {
              case 'Actor': return credits.cast || [];
              case 'Director': return crew.filter((c: any) => c.job === 'Director' || c.department === 'Directing');
              case 'Writer': return crew.filter((c: any) => c.job === 'Writer' || c.department === 'Writing');
            }
          })
        );
      })
    );
  }

  searchPerson(name: string): Observable<any[]> {
    return this.api.searchPerson(name).pipe(map((r: any) => r.results || []));
  }
}