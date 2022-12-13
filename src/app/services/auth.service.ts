import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/compat/app';
import { User } from '../models/User';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afs: AngularFirestore, // Inject Firestore service
    private afAuth: AngularFireAuth // Inject Firebase auth service)
  ) {}
  public signInWithGoogle(): void {
    this.authLogin(new firebase.default.auth.GoogleAuthProvider());
  }
  private authLogin(provider: firebase.default.auth.AuthProvider) {
    return this.afAuth.signInWithPopup(provider).then((res) => {
      console.log(res);
      this.setUserData(res.user as User)
    });
  }

  private setUserData(user?: User): Promise<void> | void {
    if(!user) return;
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      // this.router.navigate(['sign-in']);
    });
  }
}
