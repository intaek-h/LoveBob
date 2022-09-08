import { useState } from "react";
import NearbyRestaurants, { Restaurant } from "./NearbyRestaurants";
import NearbySearch from "./NearbySearch";

export interface Coords {
  address: string;
  x: string;
  y: string;
}

const NearbySearchContainer = () => {
  const [coords, setCoords] = useState<Coords>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>();

  if (restaurants) return <NearbyRestaurants restaurants={restaurants} />;

  return <NearbySearch coords={coords} setCoords={setCoords} setRestaurants={setRestaurants} />;
};

export default NearbySearchContainer;
