import { encode } from "https://deno.land/std@0.184.0/encoding/base64.ts";
import { Artwork, ArtworkPlus, Filter, Stats } from "./types.ts";

const WADM_HOST = "https://www.werkaandemuur.nl/api";
const WADM_PAGE_SIZE = 10;

export class WAMClient {
  private userId: number;
  private accessToken: string;
  private config: {
    host: string;
    /* The number of artworks to fetch per page. Default = 10, max = 33 */
    pageSize: number;
    debug: boolean;
  };

  constructor(
    userId: number,
    accessToken: string,
    config: {
      host?: string;
      pageSize?: number;
      debug?: boolean;
    } = {},
  ) {
    this.userId = userId;
    this.accessToken = accessToken;

    if (config.pageSize && (config.pageSize < 1 || config.pageSize > 33)) {
      throw new Error("pageSize must be between 1 and 33");
    }

    this.config = {
      host: config.host || WADM_HOST,
      pageSize: config.pageSize || WADM_PAGE_SIZE,
      debug: config.debug || false,
    };
  }

  private getHeaders(): Headers {
    const headers = new Headers();
    headers.set("User-Agent", `deno-wadm-client-1.0.0`);
    headers.set("Authorization", `Basic ${encode(`${this.userId}:${this.accessToken}`)}`);
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    return headers;
  }

  private get urls(): Record<string, string> {
    return {
      connectionTest: `${this.config.host}/connectiontest`,
      authenticationTest: `${this.config.host}/authenticationtest`,
      artworks: `${this.config.host}/artlist/${this.userId}/${this.config.pageSize}`,
      artwork: `${this.config.host}/artwork`,
      albums: `${this.config.host}/album`,
    };
  }

  private authFetch(url: string, filter?: Filter): Promise<Response> {
    const fetchURL = new URL(url);

    if (filter) {
      if (filter.medium) {
        fetchURL.searchParams.set("mediumId", filter.medium.toString());
      }
      if (filter.size) {
        fetchURL.searchParams.set("size", filter.size);
      }
      if (filter.languageCode) {
        fetchURL.searchParams.set("languageCode", filter.languageCode);
      }
      if (filter.locale) {
        fetchURL.searchParams.set("locale", filter.locale);
      }
    }

    if (this.config.debug) {
      console.log(`Fetching :: ${fetchURL.toString()}`);
    }

    return fetch(fetchURL, {
      headers: this.getHeaders(),
    });
  }

  private enhanceArtwork(artwork: Artwork): ArtworkPlus {
    const image = artwork.images[Object.keys(artwork.images)[0]];
    const ratioNum = artwork.dimensions.split("x").map((x) => parseInt(x, 10)).filter((x) =>
      !Number.isNaN(x)
    );
    const ratio = ratioNum.length === 2 ? ratioNum[0] / ratioNum[1] : 1;

    return {
      ...artwork,
      image,
      ratio,
    };
  }

  async connectionTest(): Promise<boolean> {
    try {
      const result = await fetch(this.urls.connectionTest);
      return !!(result && result.ok);
    } catch (e) {
      if (this.config.debug) {
        console.error(e);
      }
      return false;
    }
  }

  async authenticationTest(): Promise<boolean> {
    try {
      const result = await this.authFetch(this.urls.authenticationTest);
      return !!(result && result.ok);
    } catch (e) {
      if (this.config.debug) {
        console.error(e);
      }
      return false;
    }
  }

  async getArtworksPage(
    page = 1,
    filter?: Filter,
  ): Promise<{ artworks: ArtworkPlus[]; stats: Stats } | null> {
    const url = `${this.urls.artworks}/${page}${filter?.order ? `/${filter.order}/` : "/"}`;
    try {
      const result = await this.authFetch(url, filter);
      if (result && result.ok) {
        const data = await result.json();
        if (data && data.data && data.data.artworks) {
          const { artworks, stats } = data.data as { artworks: Artwork[]; stats: Stats };
          return { artworks: artworks.map(this.enhanceArtwork), stats };
        }
      }
      return null;
    } catch (e) {
      throw e.message;
    }
  }

  async getArtworks(filter?: Filter): Promise<ArtworkPlus[]> {
    let totalArtworks: ArtworkPlus[] = [];
    let ended = false;
    let page = 1;

    while (!ended) {
      const data = await this.getArtworksPage(page, filter);
      if (data) {
        totalArtworks = totalArtworks.concat(data.artworks);
        if (data.stats.currentPage === data.stats.totalPages) {
          ended = true;
        }
      } else {
        ended = true;
      }
      page++;
    }

    return totalArtworks;
  }

  async getArtworkById(artworkId: number, filter?: Filter): Promise<ArtworkPlus | null> {
    if (!artworkId) throw new Error("No artworkId provided!");
    const url = `${this.urls.artwork}/${artworkId}/`;
    try {
      const result = await this.authFetch(url, filter);
      if (result && result.ok) {
        const data = await result.json();
        if (data && data.data && data.data.artwork) {
          return this.enhanceArtwork(data.data.artwork as Artwork);
        }
      }
      return null;
    } catch (e) {
      throw e.message;
    }
  }

  async getArtworksByAlbumId(
    albumId: number,
    page = 1,
    filter?: Filter,
  ): Promise<{ artworks: ArtworkPlus[]; stats: Stats } | null> {
    if (!albumId) throw new Error("No albumId provided!");
    const url = `${this.urls.albums}/${albumId}/${page}${
      filter?.order ? `/${filter.order}/` : "/"
    }`;
    try {
      const result = await this.authFetch(url, filter);
      if (result && result.ok) {
        const data = await result.json();
        if (data && data.data && data.data.artworks) {
          const { artworks, stats } = data.data as { artworks: Artwork[]; stats: Stats };
          return { artworks: artworks.map(this.enhanceArtwork), stats };
        }
      }
      return null;
    } catch (e) {
      throw e.message;
    }
  }

  async getArtworksByAlbum(albumId: number, filter?: Filter): Promise<ArtworkPlus[]> {
    let totalArtworks: ArtworkPlus[] = [];
    let ended = false;
    let page = 1;

    while (!ended) {
      const data = await this.getArtworksByAlbumId(albumId, page, filter);
      if (data) {
        totalArtworks = totalArtworks.concat(data.artworks);
        if (data.stats.currentPage === data.stats.totalPages) {
          ended = true;
        }
      } else {
        ended = true;
      }
      page++;
    }

    return totalArtworks;
  }
}
