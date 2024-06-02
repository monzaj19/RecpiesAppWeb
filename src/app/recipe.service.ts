import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:8080/api/recipes'
  private apiKey = '2996274c568e45669322e7576a63e026';

  constructor(private http: HttpClient) { }

  getRecipes(query: string): Observable<any> {
    const url = `${this.apiUrl}?query=${encodeURIComponent(query)}`;
    return this.http.get(url);
  }

  getRecipeById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/recipe/${id}`, {
      params: {
        apiKey: this.apiKey
      }
    });
  }

}
