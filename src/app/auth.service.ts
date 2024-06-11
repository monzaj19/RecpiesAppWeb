import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<firebase.User | null>;

  constructor(private fireauth: AngularFireAuth, private router: Router) {
    this.user$ = this.fireauth.authState;
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
}
