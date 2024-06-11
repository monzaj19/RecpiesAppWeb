import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import firebase from "firebase/compat";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass']
})
export class MainPageComponent implements OnInit {
  saladRecipes: any[] = [];
  searchResults: any[] = [];
  searchQuery: string = '';
  searchActive: boolean = false;
  isProfilePage: boolean = false;
  user$: Observable<firebase.User | null>;
  customOptions: OwlOptions = {
    loop: true,
    margin: -100,
    nav: true,
    dots: true
  };

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.loadSaladRecipes();
  }

  login(): void {
    this.authService.loginWithGoogle();
  }

  logout(): void {
    this.authService.logout();
  }

  loadSaladRecipes(): void {
    const query = 'salad';
    this.recipeService.getRecipes(query).subscribe(
      (response) => {
        if (response && response.results) {
          this.saladRecipes = response.results.map((recipe: { image: any; }) => ({
            ...recipe,
            image: recipe.image || 'https://via.placeholder.com/300x200'
          }));
        } else {
          this.saladRecipes = [];
          console.log('No recipes found');
        }
      },
      (error) => {
        console.error('Error fetching salad recipes', error);
        this.saladRecipes = [];
      }
    );
  }

  loadRecipes(): void {
    if (!this.searchQuery.trim()) {
      this.searchActive = false;
      return;
    }

    this.recipeService.getRecipes(this.searchQuery).subscribe(
      (response) => {
        if (response && response.results) {
          this.searchResults = response.results.map((recipe: { image: any; }) => ({
            ...recipe,
            image: recipe.image || 'https://via.placeholder.com/300x200'
          }));
          this.searchActive = true;
        } else {
          this.searchResults = [];
          this.searchActive = false;
          console.log('No search results found');
        }
      },
      (error) => {
        console.error('Error fetching recipes', error);
        this.searchResults = [];
        this.searchActive = false;
      }
    );
  }

  goToProfile(): void {
    this.isProfilePage = true;
  }

  showCarousel(): void {
    this.searchActive = false;
    this.isProfilePage = false;
    this.router.navigate(['/recipes']);
  }

  viewRecipeDetails(recipeId: number): void {
    this.router.navigate(['/recipe', recipeId]);
  }
}
