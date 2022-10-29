import React, { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import Card from '../../shared/components/UIElements/Card'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import './PlaceForm.css'

const UpdatePlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [place, setPlace] = useState()
  const placeId = useParams().placeId
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  )

  useEffect(() => {
    const getPlace = async () => {
      try {
        const data = await sendRequest(`${process.env.REACT_APP_API_URL}/places/${placeId}`)
        setPlace(data)
        setFormData(
          {
            title: {
              value: data.title,
              isValid: true,
            },
            description: {
              value: data.description,
              isValid: true,
            },
          },
          true
        )
      } catch (error) {
        console.log(error)
      }
    }
    getPlace()
  }, [sendRequest, placeId, setFormData])
  const history = useHistory()
  const auth = useContext(AuthContext)
  const placeUpdateSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` }
      )
      history.push(`/${auth.userId}/places`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!place && !error && (
        <div className='center'>
          <Card>
            <h2>Could not find place.</h2>
          </Card>
        </div>
      )}
      {!isLoading && place && (
        <>
          <h2 className='center white'>Edit Place</h2>
          <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
            <Input
              id='title'
              element='input'
              type='text'
              label='Title'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Please enter a valid title.'
              onInput={inputHandler}
              initialValue={formState.inputs.title.value}
              initialValid={formState.inputs.title.isValid}
            />
            <Input
              id='description'
              element='textarea'
              label='Description'
              validators={[VALIDATOR_MINLENGTH(10)]}
              errorText='Please enter a description (min 10 characters).'
              onInput={inputHandler}
              initialValue={formState.inputs.description.value}
              initialValid={formState.inputs.description.isValid}
            />
            <Button type='submit' disabled={!formState.isValid}>
              Submit
            </Button>
          </form>
        </>
      )}
    </>
  )
}

export default UpdatePlace
