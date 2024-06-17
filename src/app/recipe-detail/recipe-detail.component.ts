import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {AuthService} from "../auth.service";
import {Observable} from "rxjs";
import firebase from "firebase/compat";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.sass']
})
export class RecipeDetailComponent implements OnInit {
  recipe: any;
  sanitizedInstructions: SafeHtml | undefined;
  user$: Observable<firebase.User | null>;
  isFavorite: boolean = false;
  isProfilePage: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    const recipeId: string | null = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      this.loadRecipeDetails(recipeId);
    }
    this.checkIfFavorite();
  }

  login(): void {
    this.authService.loginWithGoogle();
  }

  logout(): void {
    this.authService.logout();
  }

  goToProfile(): void {
    this.isProfilePage = true;
  }

  loadRecipeDetails(recipeId: string): void {
    this.recipeService.getRecipeById(recipeId).subscribe(
      (response) => {
        console.log('Recipe details fetched:', response); // Log fetched recipe
        this.recipe = response;
        this.sanitizedInstructions = this.sanitizer.bypassSecurityTrustHtml(this.recipe.instructions);
        this.checkIfFavorite(); // Check if the recipe is favorite after loading it
      },
      (error) => {
        console.error('Error fetching recipe details', error);
      }
    );
  }

  toggleFavorite(): void {
    this.authService.user$.subscribe((user: firebase.User | null) => {
      if (user) {
        if (this.isFavorite) {
          this.authService.removeFavoriteRecipe(user.uid, this.recipe)
            .then(() => this.isFavorite = false);
        } else {
          this.authService.addFavoriteRecipe(user.uid, this.recipe)
            .then(() => this.isFavorite = true);
        }
      }
    });
  }

  checkIfFavorite(): void {
    this.authService.getFavorites().subscribe((favorites) => {
      if (this.recipe && this.recipe.id) {
        this.isFavorite = favorites.some((r: any) => r.id === this.recipe.id);
        console.log('Favorite status:', this.isFavorite);
      } else {
        console.error('Recipe is undefined or does not have an id');
      }
    });
  }

}
