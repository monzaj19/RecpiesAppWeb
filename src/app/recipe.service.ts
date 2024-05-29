import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:8080/api/recipes'

  constructor(private http: HttpClient) { }

  getRecipes(query: string): Observable<any> {
    const url = `${this.apiUrl}?query=${encodeURIComponent(query)}`;
    return this.http.get(url);
  }

}
