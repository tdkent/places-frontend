import React from "react";

import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Jean Sibelius",
      image:
        "https://images.pexels.com/photos/852793/pexels-photo-852793.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
      places: 10,
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
