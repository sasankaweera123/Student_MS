import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { UserProfile } from '../interface/user-profile';
import { Observable, Subject } from 'rxjs';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: 'Your Client ID',
  scope: 'openid profile email',
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  userProfileSubject = new Subject<UserProfile>();

  constructor(private readonly oAuthService: OAuthService) { 
    this.oAuthService.configure(oAuthConfig);
    this.oAuthService.logoutUrl = "https://accounts.google.com/logout"
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(_ => {
      this.oAuthService.tryLoginImplicitFlow().then(_ => {
        if(!oAuthService.hasValidAccessToken()){
          this.oAuthService.initLoginFlow();
        }else{
          this.oAuthService.loadUserProfile().then((userProfile) => {
            this.userProfileSubject.next(userProfile as UserProfile);
          });
        }
      });
    });
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  signOut(): void {
    this.oAuthService.logOut();
  }
  private loadUserProfile(): void {
    this.oAuthService.loadUserProfile().then((userProfile) => {
      this.userProfileSubject.next(userProfile as UserProfile);
    }).catch(error => {
      console.error('Error loading user profile:', error);
    });
  }

  getUserProfile(): Observable<UserProfile> {
    if (this.isLoggedIn()) {
      return this.userProfileSubject.asObservable();
    } else {
      throw new Error('User is not logged in.');
    }
  }

}
