import axios, { AxiosInstance } from "axios";

export interface RestaurantsResponse {
  success: boolean;
  result: Restaurant[];
}

export interface Restaurant {
  id: string;
  building_number: string;
  name: string;
  road: string;
  sgg_nm: string;
  sido_nm: string;
  subName: string;
  x: number;
  y: number;
}

interface NearbyRestaurantsArgs {
  x: string;
  y: string;
}

class RestaurantService {
  constructor(private api: AxiosInstance) {}

  public getNearbyRestaurants = async ({ x, y }: NearbyRestaurantsArgs) => {
    const { data } = await this.api.get<RestaurantsResponse>(`/api/restaurants?x=${x}&y=${y}`);
    return data;
  };
}

export default new RestaurantService(axios);
