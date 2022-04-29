/************ Type Checking State ************/

export interface Image {
  url: string;
  alternativeText: string;
}

export interface ArtDisplay {
  id: string;
  title: string;
  artist: string;
  description: string;
  primary_image: Image;
  other_images: Image[];
  year: string;
  qr_code: string;
  campus: string;
  likes: Number; //Overall likes
  liked: boolean; // Specific to user (locally derived)
  disliked: boolean; // Specific to user (locally derived)
  artwork_type_clue: string;
  clue: any;
  Videos: Video[];
}

export interface Video {
  youtube_id: string;
  youtube_url: string;
  title: string;
  author: string;
  user?: any;
}

export interface ArtDisplaysState {
  currentArtDisplay: ArtDisplay;
  pastArtDisplays: ArtDisplay[];
  unsolvedArtDisplays: ArtDisplay[];
  // user: any
}

//Saving this for future use when we incorporate user
// export interface SystemState {
//   loggedIn: boolean
//   session: string
//   userName: string
// }
