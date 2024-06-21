import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
  searchActive: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

  showCarousel(): void {
    this.isProfilePage = false;
    this.router.navigate(['/recipes']);
  }

  goToProfile(): void {
    this.isProfilePage = true;
  }

  loadRecipeDetails(recipeId: string): void {
    this.recipeService.getRecipeById(recipeId).subscribe(
      (response) => {
        this.recipe = response;
        if (!this.recipe.image) {
          this.recipe.image = 'assets/cooker.png';
        }
        this.sanitizedInstructions = this.sanitizer.bypassSecurityTrustHtml(this.recipe.instructions);
        this.checkIfFavorite();
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
          if (this.recipe && this.recipe.id) {
            this.authService.removeFavoriteRecipe(user.uid, this.recipe)
              .then(() => this.isFavorite = false);
          } else {
            console.error('Recipe is undefined or does not have an id');
          }
        } else {
          if (this.recipe && this.recipe.id) {
            this.authService.addFavoriteRecipe(user.uid, this.recipe)
              .then(() => this.isFavorite = true);
          } else {
            console.error('Recipe is undefined or does not have an id');
          }
        }
      }
    });
  }

  checkIfFavorite(): void {
    this.authService.getFavorites().subscribe((favorites) => {
      if (this.recipe && this.recipe.id) {
        this.isFavorite = favorites.some((r: any) => r.id === this.recipe.id);
      } else {
        console.error('Recipe is undefined or does not have an id');
      }
    });
  }


}
