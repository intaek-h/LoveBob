import { AxiosInstance, AxiosResponse } from "axios";
import { kakaoMapApi } from "../apis/kakao";
import { AddressToCoords } from "../apis/kakao/types";

class ApiService {
  constructor(private api: AxiosInstance) {}

  public kakaoApiAddressToCoords = async (query: string) =>
    await this.api.get<AddressToCoords>(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
        },
      }
    );
}

export default new ApiService(kakaoMapApi);
