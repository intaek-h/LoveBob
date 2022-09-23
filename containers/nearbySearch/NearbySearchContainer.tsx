import { useState } from "react";
import NearbyRestaurants from "../../components/search/NearbyRestaurants";
import NearbySearch from "../../components/search/NearbySearch";
import { NearbyRestaurant } from "../../services/RestaurantService";

export interface Coords {
  address: string;
  x: string;
  y: string;
}

const NearbySearchContainer = () => {
  const [coords, setCoords] = useState<Coords>();
  const [restaurants, setRestaurants] = useState<NearbyRestaurant[]>();

  const resetSearch = () => {
    setCoords(undefined);
    setRestaurants(undefined);
  };

  if (restaurants)
    return (
      <NearbyRestaurants restaurants={restaurants} address={coords?.address} reset={resetSearch} />
    );

  return <NearbySearch coords={coords} setCoords={setCoords} setRestaurants={setRestaurants} />;
};

export default NearbySearchContainer;
