import {Component, OnInit} from '@angular/core';
import {RecipeService} from "../recipe.service";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.sass']
})
export class RecipeListComponent implements OnInit {

  searchQuery: string = '';

  recipes: any[] = [];

  isLoading: boolean = false;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    if (!this.searchQuery.trim()){
      this.recipes = [];
      return;
    }

    this.isLoading = true;

    this.recipeService.getRecipes(this.searchQuery).subscribe(
      (response) => {
        if (response?.results) {
          this.recipes = response.results;
        } else {
          this.recipes = [];
        }
      },
      (error) => {
        console.error('Error fetching recipes', error);
        this.recipes = [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

}
