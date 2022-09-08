import { VisitedRestaurantResponse } from "./../pages/api/users/[id]/visits/index";
import { Inputs } from "./../components/profile/ProfileChangeForm";
import axios, { AxiosInstance } from "axios";
import { DefaultResponse } from "../apis/types";
import { ProfileResponse } from "../pages/api/users";

interface ProfileImageArgs {
  userId: string;
  image: string;
  type: "image";
}

interface ProfileTextArgs {
  userId: string;
  title: Inputs["title"];
  description: Inputs["description"];
  type: "description";
}

export interface VisitedRestaurantArgs {
  userId: string;
  restaurantId: string;
}

class ProfileService {
  constructor(private api: AxiosInstance) {}

  public getUserFromSession = async () => {
    const { data } = await this.api.get<ProfileResponse>("/api/users");
    return data;
  };

  public changeProfileImage = async ({ userId, image, type }: ProfileImageArgs) => {
    const { data } = await this.api.put<DefaultResponse>(`/api/users/${userId}`, {
      type,
      image,
    });
    return data;
  };

  public changeProfileText = async ({ userId, title, description, type }: ProfileTextArgs) => {
    const { data } = await this.api.put<DefaultResponse>(`/api/users/${userId}`, {
      title,
      description,
      type,
    });
    return data;
  };

  public getVisitedRestaurants = (userId: string) => async () => {
    const { data } = await this.api.get<VisitedRestaurantResponse>(`/api/users/${userId}/visits`);
    return data;
  };

  public addVisitedRestaurant = async ({ userId, restaurantId }: VisitedRestaurantArgs) => {
    const { data } = await this.api.post<DefaultResponse>(
      `/api/users/${userId}/visits/${restaurantId}`
    );
    return data;
  };

  public deleteVisitedRestaurant = async ({ userId, restaurantId }: VisitedRestaurantArgs) => {
    const { data } = await this.api.delete<DefaultResponse>(
      `/api/users/${userId}/visits/${restaurantId}`
    );
    return data;
  };
}

export default new ProfileService(axios);
