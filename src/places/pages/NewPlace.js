import React, { useContext } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import './PlaceForm.css'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'

const NewPlace = () => {
  const auth = useContext(AuthContext)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  )
  const history = useHistory()
  const placeSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('image', formState.inputs.image.value)
      const imageUrl = await sendRequest(`${process.env.REACT_APP_ASSET_API}`, 'POST', formData)
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/places`,
        'POST',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: auth.userId,
          image: imageUrl.imageUrl,
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
      <h2 className='center white'>Add a Place</h2>
      <form className='place-form' onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id='title'
          element='input'
          type='text'
          label='Title'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid title.'
          onInput={inputHandler}
        />
        <Input
          id='description'
          element='textarea'
          label='Description'
          validators={[VALIDATOR_MINLENGTH(10)]}
          errorText='Please enter a valid description (at least 10 characters).'
          onInput={inputHandler}
        />
        <Input
          id='address'
          element='input'
          label='Address'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid address.'
          onInput={inputHandler}
        />
        <ImageUpload id='image' onInput={inputHandler} errorText='Please provide an image.' />
        <Button type='submit' disabled={!formState.isValid}>
          Submit
        </Button>
      </form>
    </>
  )
}

export default NewPlace
