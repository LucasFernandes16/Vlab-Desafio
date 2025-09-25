import { Injectable, inject } from '@angular/core';
import { MovieApiService } from '../api/movie.api';
import { MovieStateService } from '../state/movie.state';
import { map, tap, catchError,switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Movie } from '../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class MovieFacade {
  public api = inject(MovieApiService);
  private state = inject(MovieStateService);

  movies$ = this.state.movies$;

  loadPopularMovies(page = 1) {
    this.state.setLoading(true);
    this.api.getPopularMovies(page).pipe(
      tap(response => {
        this.state.setMovies(response.results);
        this.state.setPagination(response.page, response.total_pages);
        this.state.setLoading(false);
      }),
      catchError(err => {
        this.state.setError('Failed to load popular movies.');
        this.state.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  searchMovies(query: string, page = 1) {
    this.state.setLoading(true);
    this.api.searchMovies(query, page).pipe(
      tap(response => {
        this.state.setMovies(response.results);
        this.state.setPagination(response.page, response.total_pages);
        this.state.setLoading(false);
      }),
      catchError(err => {
        this.state.setError('Failed to search movies.');
        this.state.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

   getMovieDetails(movieId: number): Observable<Movie> {
    return this.api.getMovieDetails(movieId);
  }

    searchDirectorMovies(name: string): Observable<any[]> {
    return this.api.searchPerson(name).pipe(
      switchMap((res: any) => {
        if (res.results.length > 0) {
          const personId = res.results[0].id;
          return this.api.getPersonMovies(personId).pipe(
            map((credits: any) => credits.crew.filter((c: any) => c.job === "Director"))
          );
        }
        return of([]);
      })
    );
  }

  searchMoviesByPerson(name: string, job: 'Actor' | 'Director' | 'Writer' = 'Actor') {
  return this.api.searchPerson(name).pipe(
    switchMap((res: any) => {
      if (res.results.length === 0) return of([]);
      const personId = res.results[0].id;
      return this.api.getPersonMovies(personId).pipe(
        map((credits: any) => {
          switch (job) {
            case 'Actor':
              return credits.cast || [];
            case 'Director':
              return (credits.crew || []).filter((c: any) => c.job === 'Director' || c.department === 'Directing');
            case 'Writer':
              return (credits.crew || []).filter((c: any) => c.job === 'Writer' || c.department === 'Writing');
          }
        })
      );
    })
  );
}

searchPerson(name: string): Observable<any[]> {
  return this.api.searchPerson(name).pipe(
    map((res: any) => res.results || [])
  );
}


}