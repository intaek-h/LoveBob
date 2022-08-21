import { AxiosInstance, AxiosResponse } from "axios";
import { AddressToCoords } from "../types/externals/kakao";

class ApiService {
  constructor(private API: AxiosInstance) {}

  public kakaoApiAddressToCoords = async (query: string): Promise<AxiosResponse<AddressToCoords>> =>
    await this.API.get(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
        },
      }
    );
}

export default ApiService;
