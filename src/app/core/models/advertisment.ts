export interface Advertisement {
  advertisement: {
    id?: number,
    start_date: string,
    end_date: string,
    advertisement_type: number,
    sale: number,
    is_main: number,
  };
  images: AdvertisementImage[];
}
export interface AdvertisementResponse {
  // advertisement: {
    advertisement_type: {
      id: number,
      title: string,
      code: string,
    };
    code: string;
    id: number;
    title: string;
    end_date: string;
    sale: any;
    start_date: string;
  // };
  images: AdvertisementImage[];
}
interface AdvertisementImage {
  image: string;
  language: number;
}

export interface AdvertisementType {
  id: number;
  title: string;
  code: string;
}

