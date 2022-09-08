import axios from "axios";

const BASE_URL = "https://dapi.kakao.com/v2/";

export const kakaoMapApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
  },
});
