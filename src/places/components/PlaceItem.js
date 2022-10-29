import React, { useState, useContext } from 'react'

import Card from '../../shared/components/UIElements/Card'
import Button from '../../shared/components/FormElements/Button'
import Modal from '../../shared/components/UIElements/Modal'
import Map from '../../shared/components/UIElements/Map'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import './PlaceItem.css'

const PlaceItem = ({ id, image, title, address, coordinates, description, creatorId, items, setPlaces }) => {
  const [showMap, setShowMap] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const openMapHandler = () => setShowMap(true)
  const closeMapHandler = () => setShowMap(false)

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true)
  }

  const cancelDeleteWarningHandler = () => {
    setShowConfirmModal(false)
  }
  const confirmDeleteHandler = async () => {
    try {
      setShowConfirmModal(false)
      await sendRequest(`${process.env.REACT_APP_API_URL}/places/${id}`, 'DELETE', null, {
        Authorization: `Bearer ${auth.token}`,
      })
      const updatePlacesArray = items.filter((place) => place.id !== id)
      setPlaces(updatePlacesArray)
    } catch (error) {
      console.log(error)
    }
  }

  const auth = useContext(AuthContext)
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className='map-container'>
          <Map center={coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteWarningHandler}
        header='Delete?'
        footerClass='place-item__modal-actions'
        footer={
          <>
            <Button inverse onClick={cancelDeleteWarningHandler}>
              Cancel
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete <b>{title}</b>?
        </p>
      </Modal>
      <li className='place-item'>
        <Card className='place-item__content'>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className='place-item__image'>
            <img src={image} alt={title} />
          </div>
          <div className='place-item__info'>
            <h2>{title}</h2>
            <p>{address}</p>
            <p>{description}</p>
          </div>
          <div className='place-item__actions'>
            <Button inverse onClick={openMapHandler}>
              View on Map
            </Button>
            {auth.isLoggedIn && creatorId.id === auth.userId && (
              <>
                <Button to={`/places/${id}`}>Edit</Button>
                <Button danger onClick={showDeleteWarningHandler}>
                  Delete
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  )
}

export default PlaceItem
