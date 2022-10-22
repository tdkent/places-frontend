import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import PlaceList from '../components/PlaceList'
import { useHttpClient } from '../../shared/hooks/http-hook'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'

const UserPlaces = (props) => {
  const [places, setPlaces] = useState([])
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  // useParams returns an object of the params used in the current URL.
  // Because UserPlaces is being loaded via the Route path "/:userId/places", the userId will be placed into the object.
  const userId = useParams().userId
  useEffect(() => {
    const getUserPlaces = async () => {
      try {
        const data = await sendRequest(`http://localhost:4000/api/places/user/${userId}`)
        console.log(data)
        setPlaces(data)
      } catch (error) {
        console.log(error)
      }
    }
    getUserPlaces()
  }, [userId, sendRequest])
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && places && <PlaceList items={places} setPlaces={setPlaces} />}
    </>
  )
}

export default UserPlaces
