import { NearbyRestaurantsOfRestaurantResponse } from "./../pages/api/restaurants/[restaurantId]/nearby/index";
import { ReviewCountResponse } from "./../pages/api/restaurants/[restaurantId]/review-count/index";
import { VisitStatsResponse } from "./../pages/api/restaurants/[restaurantId]/visit-stats/index";
import axios, { AxiosInstance } from "axios";

export interface RestaurantsResponse {
  success: boolean;
  result: NearbyRestaurant[];
}

export interface NearbyRestaurant {
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

  public getVisitStats = async (restaurantId: string) => {
    const { data } = await this.api.get<VisitStatsResponse>(
      `/api/restaurants/${restaurantId}/visit-stats`
    );
    return data;
  };

  public getReviewCount = async (restaurantId: string) => {
    const { data } = await this.api.get<ReviewCountResponse>(
      `/api/restaurants/${restaurantId}/review-count`
    );
    return data;
  };

  public getNearbyRestaurantsOfRestaurant = async (restaurantId: string) => {
    const { data } = await this.api.get<NearbyRestaurantsOfRestaurantResponse>(
      `/api/restaurants/${restaurantId}/nearby`
    );
    return data;
  };
}

export default new RestaurantService(axios);
