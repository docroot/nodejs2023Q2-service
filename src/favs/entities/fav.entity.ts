export class Fav {
  artists: string[];
  albums: string[];
  tracks: string[];
  constructor() {
    this.artists = new Array<string>();
    this.albums = new Array<string>();
    this.tracks = new Array<string>();
  }
}
