import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth'
import {Observable, of, switchMap} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {map} from "rxjs/operators";
import {arrayRemove, arrayUnion} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<firebase.User | null>;
  private favoritesCollection: AngularFirestoreCollection<any>;

  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore) {
    this.user$ = this.fireauth.authState;
    this.favoritesCollection = this.firestore.collection('favorites');
  }

  loginWithGoogle(): Promise<void> {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider())
      .then(res => {
        console.log('User logged in:', res.user);
        this.router.navigate(['']);
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
      })
      .catch(err => {
        console.error('Login failed:', err);
        alert(err.message);
      });
  }

  logout(): Promise<void> {
    return this.fireauth.signOut();
  }

  addFavoriteRecipe(uid: string, recipe: any): Promise<void> {
    const userDoc = this.favoritesCollection.doc(uid);
    const sanitizedRecipe = this.sanitizeRecipe(recipe);
    return userDoc.update(
      { recipes: arrayUnion(sanitizedRecipe) }
    ).catch(error => {
      if (error.code === 'not-found') {
        return userDoc.set({ recipes: [sanitizedRecipe] });
      }
      throw error;
    });
  }

  removeFavoriteRecipe(uid: string, recipe: any): Promise<void> {
    const userDoc = this.favoritesCollection.doc(uid);
    const sanitizedRecipe = this.sanitizeRecipe(recipe);
    return userDoc.update(
      { recipes: arrayRemove(sanitizedRecipe) }
    ).catch(error => {
      console.error("Error removing favorite recipe: ", error);
      throw error;
    });
  }

  private sanitizeRecipe(recipe: any): any {
    const sanitizedRecipe: any = {};
    for (const key in recipe) {
      sanitizedRecipe[key] = recipe[key] || null;
    }
    return sanitizedRecipe;
  }

  getFavorites(): Observable<any[]> {
    return this.user$.pipe(
      switchMap((user: firebase.User | null) => {
        if (user) {
          return this.favoritesCollection.doc(user.uid).valueChanges().pipe(
            map((data: any) => data?.recipes || [])
          );
        } else {
          return [];
        }
      })
    );
  }

}
