import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { AuthContext } from '../../shared/context/auth-context'
import Card from '../../shared/components/UIElements/Card'
import Button from '../../shared/components/FormElements/Button'
import PlaceItem from './PlaceItem'
import './PlaceList.css'

const PlaceList = ({ items, setPlaces }) => {
  const auth = useContext(AuthContext)
  const { userId } = useParams()
  if (!items.length) {
    return (
      <div className='place-list center'>
        <Card>
          {auth.userId === userId ? (
            <>
              <p>You haven't added any places yet!</p>
              <Button to='/places/new'>New Place</Button>
            </>
          ) : (
            <p>This user hasn't added any places yet!</p>
          )}
        </Card>
      </div>
    )
  }
  console.log(items)
  let username = items[0].creator.username
  return (
    <div className='place-list-container'>
      <h2 className='place-list-header'>
        {username}
        {username.slice(-1) === 's' ? "'" : "'s"} Places
      </h2>
      <ul className='place-list'>
        {items.map((place) => {
          return (
            <PlaceItem
              key={place.id}
              id={place.id}
              image={place.image}
              title={place.title}
              description={place.description}
              address={place.address}
              creatorId={place.creator}
              coordinates={place.location}
              items={items}
              setPlaces={setPlaces}
            />
          )
        })}
      </ul>
    </div>
  )
}

export default PlaceList
