import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "The most famous skyscraper in the world.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
    creator: "u1",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: "40.7484405",
      lng: "-73.9856644",
    },
  },
  {
    id: "p2",
    title: "Emp. State Building",
    description: "The most famous skyscraper in the world.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
    creator: "u2",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9856644
    },
  },
];

// useParams returns an object of the params used in the current URL.
// Because UserPlaces is being loaded via the Route path "/:userId/places", the userId will be placed into the object. 

const UserPlaces = (props) => {
  const userId = useParams().userId
  const placesByUserId = DUMMY_PLACES.filter(place => place.creator === userId)
  return <PlaceList items={placesByUserId} />;
};

export default UserPlaces;
