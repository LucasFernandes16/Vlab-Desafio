import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieListComponent } from './features/movies/pages/movie-list/movie-list.component';
import { MovieDetailComponent } from './features/movies/pages/movie-detail/movie-detail.component';
import { MyMarathonsComponent } from './features/movies/pages/my-marathon/my-marathon.component';
import { ThemeGeneratorComponent } from './features/movies/pages/theme-generator/theme-generator.component';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },

  // rotas do módulo de filmes
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/mymarathons', component: MyMarathonsComponent },
  { path: 'movies/generator', component: ThemeGeneratorComponent },
  { path: 'movies/:id', component: MovieDetailComponent },

  { path: '**', redirectTo: 'movies', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
