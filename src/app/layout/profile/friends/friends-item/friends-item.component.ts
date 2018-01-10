import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../../../../common/services/profile.service';
import {UserModel} from '../../../../common/models/UserModel';
import {Observable} from 'rxjs/Observable';
import {forEach} from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-friends-item',
  templateUrl: './friends-item.component.html',
  styleUrls: ['./friends-item.component.scss']
})
export class FriendsItemComponent implements OnInit {
  currentUser: UserModel;
  currentUserId: any;
  dontHaveFriends = true;
  openConfirmWindow = false;
  friends: any[] = [];
  indexOfRemovFriend: any;

  constructor(public profileService: ProfileService) {}

  ngOnInit() {
    this.dontHaveFriends = false;
    this.currentUserId = JSON.parse(localStorage.getItem('CurrentUserId'));
    this.profileService.getCurrentUser(this.currentUserId)
      .subscribe(currentUser => {
        this.currentUser = currentUser.payload.val();
        if (this.currentUser.followers === null || this.currentUser.followers === undefined) {
          this.currentUser.followers = [];
          this.dontHaveFriends = true;
        }
        this.getFriends();
      });
  }
  getFriends() {
    this.friends = this.profileService.getFriends(this.currentUser.followers);
  }
  openConfirmDialog() {
    this.openConfirmWindow = !this.openConfirmWindow;
  }

  removeFriend() {
    this.profileService.removeFriend(this.currentUserId, this.indexOfRemovFriend)
      .then(() => {
        console.log('friend removed');
      })
      .catch((err) => {
        console.log(err);
      });
    this.currentUser.followers.splice(this.indexOfRemovFriend,1);
    console.log(this.currentUser.followers);
    this.openConfirmDialog();
  }

  passIndex(indexOfRemovFriend) {
    this.indexOfRemovFriend = indexOfRemovFriend;
  }
}
