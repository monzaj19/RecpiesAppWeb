import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

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
  customOptions: OwlOptions = {
    loop: true,
    margin: -100,
    nav: true,
    dots: true
  };

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadSaladRecipes();
  }

  loadSaladRecipes(): void {
    const query = 'salad';
    this.recipeService.getRecipes(query).subscribe(
      (response) => {
        console.log('Salad Recipes Response:', response);
        if (response && response.results) {
          this.saladRecipes = response.results.map((recipe: { image: any; }) => ({
            ...recipe,
            image: recipe.image || 'https://via.placeholder.com/300x200'
          }));
          console.log('Salad Recipes:', this.saladRecipes);
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
          console.log('Search Results:', this.searchResults);
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

  showCarousel(): void {
    this.searchActive = false;
    console.log('Showing Carousel');
  }
}
