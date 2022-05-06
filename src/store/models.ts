/************ Type Checking State ************/

/*  artdisplay */

interface Image {
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

// for initial state
export const defaultCurrentArtDisplay = {
  id: "default",
  title: "New York City",
  artist: "Frédéric Thery",
  year: "2020",
  campus: "Brooklyn College",
  primary_image: {
    url: require("../assets/images/frederic-thiery-new-york-city.jpg"),
    alternativeText: `Porte St Denis`,
  },
  other_images: [
    {
      url: "https://thumbs.nosto.com/quick/carredaristesus/8/566319340/bf154f4dac1b717cbb33730d656942ab770c24901577ab681fd46cea97c5ecf3a/A",
      alternativeText: "Petit marché",
    },
    {
      url: "https://thumbs.nosto.com/quick/carredaristesus/8/566318950/ece2915fbc817e011d922b80c2b77700ff103a74a707724342da12f16f169d13a/A",
      alternativeText: "Porte St Denis",
    },
  ],
  description:
    "Inspired by a painter father, Frédéric was interested from a very early age in drawing and painting. He studied fine arts at the University of Aix-en-Provence. After graduation, he moved to southern Spain where he discovered various crafts: leather work, silk painting, jewellery making…By g in contact with these artisans he learned to make leather accessories (belts, bags) and experimented with cold enamel work (producing the same aesthetic effect as enamel, but without firing). He attended a workshop on porcelain painting to learn this technique and soon he experienced the urge to paint on canvas.",
  qr_code: "",
  likes: 0,
  liked: false,
  disliked: false,
  artwork_type_clue: "",
  clue: "",
  Videos: [
    {
      youtube_id: "hZ1OgQL9_Cw",
      youtube_url: "https://www.youtube.com/watch?v=hZ1OgQL9_Cw",
      title: "A Trip Through New York City in 1911",
      author: "Denis Shiryaev",
    },
    {
      youtube_id: "bYUKSx_bhHM",
      youtube_url:
        "https://www.youtube.com/watch?v=https://www.youtube.com/watch?v=bYUKSx_bhHM",
      title: "Footage and History of the Five Boroughs of New York City (1946)",
      author: "",
    },
  ],
};

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
  allArtDisplays: ArtDisplay[];
  campuses: any[];
  // user: any
}

//Saving this for future use when we incorporate user
// export interface SystemState {
//   loggedIn: boolean
//   session: string
//   userName: string
// }

/*  general */

export interface GeneralState {
  allArtDisplays: ArtDisplay[];
  campuses: any[];
}

/* user */

export interface User {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: any;
  campus?: any;
  campus_name: string;
  campus_id: any;
  scanned_artworks: any[];
  total_points: number;
  liked_artworks: any[];
  disliked_artworks: any[];
  solved_artworks: any[];
  unsolved_artworks?: any[];
}

export interface UserState {
  user: User;
  campus: any;
  authToken: string;
}
