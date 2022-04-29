/************ Type Checking State ************/

export interface User {
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: any;
  campusName: string;
  campusId: any;
  scanned_artworks: [];
  total_points: number;
  liked_artworks: [];
  disliked_artworks: [];
  solved_artworks: [];
  unsolved_artworks: [];
}

export interface UserState {
  user: User;
  campus: any;
  authToken: string;
}
