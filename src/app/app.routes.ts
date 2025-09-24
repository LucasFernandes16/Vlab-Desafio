import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'movies',
    loadChildren: () =>
      import('./features/movies/movies.routes').then(m => m.MOVIE_ROUTES),
  },
  {
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'movies',
    pathMatch: 'full',
  },
];
