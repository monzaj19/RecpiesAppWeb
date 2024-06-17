import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent implements OnInit {
  user$: Observable<firebase.User | null>;
  favoriteRecipes: any[] = [];

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.loadFavoriteRecipes(user.uid);
      }
    });
  }

  loadFavoriteRecipes(uid: string): void {
    this.authService.getFavorites().subscribe(favorites => {
      this.favoriteRecipes = favorites;
      console.log('Loaded favorite recipes:', this.favoriteRecipes);
    });
  }

}
