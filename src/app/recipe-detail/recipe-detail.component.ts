import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.sass']
})
export class RecipeDetailComponent implements OnInit {
  recipe: any;
  sanitizedInstructions: SafeHtml | undefined;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const recipeId: string | null = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      this.loadRecipeDetails(recipeId);
    }
  }

  loadRecipeDetails(recipeId: string): void {
    this.recipeService.getRecipeById(recipeId).subscribe(
      (response) => {
        this.recipe = response;
        this.sanitizedInstructions = this.sanitizer.bypassSecurityTrustHtml(this.recipe.instructions);
      },
      (error) => {
        console.error('Error fetching recipe details', error);
      }
    );
  }
}
