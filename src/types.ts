export interface Stats {
  totalArtworks: number;
  artworkCount: number;
  currentPage: number;
  totalPages: number;
}
export interface Artwork {
  id: number;
  title: string;
  link: string;
  images: Record<string, string>;
  imagesHttps: Record<string, string>;
  pricing: string[];
  dimensions: string;
  medium: string;
}

export interface ArtworkPlus extends Artwork {
  image: string;
  ratio: number;
}

export interface ArtworkPlus extends Artwork {
  image: string;
  ratio: number;
}

export enum Order {
  DateAsc = "date_asc",
  DateDesc = "date_desc",
  TitleAsc = "title_asc",
  TitleDesc = "title_desc",
}

export enum Medium {
  Canvas = 1,
  FramedPrint = 2,
  PosterPhotoprint = 3,
  AluDibond = 4,
  Xpozer = 5,
  Wood = 8,
  Steel = 11,
  Wallpaper = 12,
  AcousticPrints = 13,
  AluDibondAcryl = 15,
  SeamlessWallpaper = 16,
  Round = 17,
}

export enum Size {
  Small = "small",
  Medium = "medium",
  Large = "large",
  XLarge = "xlarge",
}

export enum LanguageCode {
  NL = "nl",
  DE = "de",
  FR = "fr",
  EN = "en",
}

export enum Locale {
  NL_NL = "nl_NL",
  DE_DE = "de_DE",
  FR_FR = "fr_FR",
  DE_AT = "de_AT",
  DE_CH = "de_CH",
  FR_CH = "fr_CH",
  EN_GB = "en_GB",
  EN_US = "en_US",
}

export interface Filter {
  order?: Order;
  medium?: Medium;
  size?: Size;
  languageCode?: LanguageCode;
  locale?: Locale;
}
