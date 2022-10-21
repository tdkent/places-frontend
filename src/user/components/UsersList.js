import React from 'react'

import Card from '../../shared/components/UIElements/Card'
import UserItem from './UserItem'
import './UsersList.css'

const UsersList = ({ items }) => {
  if (!items.length) {
    return (
      <div className='center'>
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    )
  }
  return (
    <ul className='users-list'>
      {items.map((user) => (
        <UserItem key={user.id} id={user.id} image={user.image} name={user.username} placeCount={user.places.length} />
      ))}
    </ul>
  )
}

export default UsersList
