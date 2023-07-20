import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../interface/user-profile';
import { GoogleApiService } from '../service/google-api.service';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.css']
})
export class GoogleAuthComponent implements OnInit {
  userInfo?: UserProfile;

  constructor(private readonly googleApi: GoogleApiService) { 
    googleApi.userProfileSubject.subscribe(info => {
      this.userInfo = info;
      console.log(info);
    });
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.getUserProfile();
    }
  }

  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn();
  }

  logout(): void {
    this.googleApi.signOut();
  }
  getUserProfile(): void {
    // Call the GoogleApiService method to get the user profile
    this.googleApi.getUserProfile().subscribe(
      (profile: UserProfile) => {
        this.userInfo = profile;
      },
      (error: any) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }
}