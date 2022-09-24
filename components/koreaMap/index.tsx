import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_koreaLow from "@amcharts/amcharts5-geodata/southKoreaLow";
import { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { Restaurant } from "../../pages/api/users/[id]/visits";
import { useVisitedRestaurants } from "../../hooks/queryHooks/useVisitedRestaurants";
import { ServerSideProps } from "../../pages/[bobId]";

interface Props {
  userId: ServerSideProps["profile"]["userId"];
  regions: ServerSideProps["profile"]["regions"];
}

interface VisitedRestaurant extends Restaurant {
  color: string;
  rotation?: number;
  centerX?: number;
  centerY?: number;
}

function generateDegree() {
  return Math.floor(Math.random() * (360 - 0 + 1) + 0);
}

function generateCenter() {
  return Math.floor(Math.random() * (0 - 10 + 1) + 10);
}

function generateRGB() {
  const randomNum1 = Math.floor(Math.random() * (255 - 65 + 1) + 65); // 65 ~ 255
  const randomNum2 = Math.floor(Math.random() * (255 - 65 + 1) + 65); // 65 ~ 255

  return `rgb(255, ${randomNum1}, ${randomNum2})`;
}

const MAP_BACKGROUND_COLOR = "#d4dae1";
const VISITED_RESTAURANT_MARKER_COLOR = "#f4f4f4";
const FAVORITE_RESTAURANT_MARKER_COLOR = "#51c5ff";
const FAVORITE_RESTAURANT_HOVERED_COLOR = "#7decff";

const KoreaMap = ({ userId, regions }: Props) => {
  const [visitedRestaurants, setVisitedRestaurants] = useState<VisitedRestaurant[]>();
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<VisitedRestaurant[]>();

  useVisitedRestaurants(userId, {
    onSuccess: (res) => {
      if (res.result) {
        const visitedRestaurants: VisitedRestaurant[] = [];
        const favoriteRestaurants: VisitedRestaurant[] = [];

        res.result.forEach((restaurant) => {
          if (restaurant.isFavorite) {
            favoriteRestaurants.push({
              ...restaurant,
              color: FAVORITE_RESTAURANT_MARKER_COLOR,
              centerX: generateCenter(),
              centerY: generateCenter(),
            });
          } else {
            visitedRestaurants.push({
              ...restaurant,
              color: generateRGB(),
              rotation: generateDegree(),
            });
          }
        });

        setVisitedRestaurants(visitedRestaurants);
        setFavoriteRestaurants(favoriteRestaurants);
      }
    },
  });

  useLayoutEffect(() => {
    if (!visitedRestaurants || !favoriteRestaurants) return;
    // 루트 객체
    const root = am5.Root.new("chartdiv");

    // 지도 차트 생성
    const mapChart = am5map.MapChart.new(root, {
      projection: am5map.geoMercator(),
      panX: "none",
      panY: "none",
      wheelY: "none",
    });

    // 루트 객체 컨테이너에 들어갈 지도 객체
    const chart = root.container.children.push(mapChart);

    // 한반도 지도
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_koreaLow,
        fill: am5.color(MAP_BACKGROUND_COLOR),
      })
    );

    // 지도 위에 띄울 방문한 음식점 마커
    const visitedRestaurantPointSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "x",
        longitudeField: "y",
      })
    );

    // 방문한 음식점들 좌표 데이터 주입
    visitedRestaurantPointSeries.data.setAll(visitedRestaurants);

    // 지도 위에 띄울 맛집 마커
    const favoriteRestaurantPointSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "x",
        longitudeField: "y",
      })
    );

    // 맛집 좌표 데이터 주입
    favoriteRestaurantPointSeries.data.setAll(favoriteRestaurants);

    // 마커 모양별 템플릿 생성
    const triangleTemplate: am5.Template<am5.Triangle> = am5.Template.new({});
    const rectangleTemplate: am5.Template<am5.Rectangle> = am5.Template.new({});

    // 방문한 음식점 마커 커스터마이징
    visitedRestaurantPointSeries.bullets.push(function (root, _series, dataItem) {
      const rectangleBullet = am5.Rectangle.new(
        root,
        {
          width: 10,
          height: 10,
          rotation: (dataItem.dataContext as VisitedRestaurant).rotation,
          fill: am5.color((dataItem.dataContext as VisitedRestaurant).color),
          centerX: 2,
          centerY: 2,
          fillOpacity: 0.5,
          tooltipText: "[bold]{name}[/]\n{city} {roadAddress}",
        },
        rectangleTemplate
      );

      rectangleBullet.states.create("hover", {
        fill: am5.color(VISITED_RESTAURANT_MARKER_COLOR),
        fillOpacity: 1,
      });

      return am5.Bullet.new(root, {
        sprite: rectangleBullet,
      });
    });

    // 맛집 마커 커스터마이징
    favoriteRestaurantPointSeries.bullets.push(function (root, _series, dataItem) {
      const triangleBullet = am5.Triangle.new(
        root,
        {
          width: 15,
          height: 15,
          fill: am5.color((dataItem.dataContext as VisitedRestaurant).color),
          centerX: (dataItem.dataContext as VisitedRestaurant).centerX,
          centerY: (dataItem.dataContext as VisitedRestaurant).centerY,
          fillOpacity: 0.7,
          tooltipText: "[bold]{name}[/]\n{city} {roadAddress}",
        },
        triangleTemplate
      );

      triangleBullet.states.create("hover", {
        fill: am5.color(FAVORITE_RESTAURANT_HOVERED_COLOR),
        fillOpacity: 0.7,
      });

      return am5.Bullet.new(root, {
        sprite: triangleBullet,
      });
    });

    return () => {
      root.dispose();
    };
  }, [favoriteRestaurants, visitedRestaurants]);

  return (
    <MapContainer id="chartdiv">
      <DescriptionContainer>
        {regions.length >= 2 && (
          <Description>
            거점:{" "}
            <i>
              {regions[0]} · {regions[1]}
            </i>
          </Description>
        )}
        {regions.length === 1 && (
          <Description>
            거점: <i>{regions[0]}</i>
          </Description>
        )}
        {regions.length === 0 && (
          <Description>
            거점: <i>없음</i>
          </Description>
        )}
      </DescriptionContainer>
    </MapContainer>
  );
};

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const DescriptionContainer = styled.div`
  position: absolute;
  bottom: 0px;
  right: 0px;
  text-align: center;
  padding: 5px;
`;

const Description = styled.span`
  font-size: 0.8rem;
  & > strong {
    color: ${({ theme }) => theme.text.blue_prism_1};
  }
`;

export default KoreaMap;
