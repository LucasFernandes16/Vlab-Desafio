import { Routes } from '@angular/router';


export const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./features/movies/movies.routes').then(m => m.MOVIE_ROUTES)
  },
  {
    path: 'movies',
    loadChildren: () => import('./features/movies/movies.routes').then(m => m.MOVIE_ROUTES)
  },
];
