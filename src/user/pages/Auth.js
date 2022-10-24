import React, { useState, useContext } from 'react'

import Card from '../../shared/components/UIElements/Card'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'
import './Auth.css'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'

const Auth = () => {
  const [isLogIn, setIsLogIn] = useState(true)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  )

  const auth = useContext(AuthContext)

  const authSubmitHandler = async (e) => {
    e.preventDefault()
    if (isLogIn) {
      try {
        const data = await sendRequest(
          'http://localhost:4000/api/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { 'Content-Type': 'application/json' }
        )
        auth.login(data.user.id)
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        // FormData is a browser API which accepts binary data, so it can be used to submit image data, as well as standard human-readable text, via fetch()
        const formData = new FormData()
        formData.append('name', formState.inputs.name.value)
        formData.append('email', formState.inputs.email.value)
        formData.append('password', formState.inputs.password.value)
        // 'image' is the key that the backend multer function is expecting
        formData.append('image', formState.inputs.image.value)
        const data = await sendRequest('http://localhost:4000/api/users/register', 'POST', formData)
        auth.login(data.user.id)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const switchModeHandler = () => {
    if (!isLogIn) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      )
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
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
    }
    setIsLogIn((prev) => !prev)
    console.log('swiched mode to', isLogIn)
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <form onSubmit={authSubmitHandler}>
          {!isLogIn && (
            <Input
              element='input'
              id='name'
              type='text'
              label='Your name'
              validators={[VALIDATOR_REQUIRE]}
              errorText='Please enter your name.'
              onInput={inputHandler}
            />
          )}
          {!isLogIn && <ImageUpload id='image' center onInput={inputHandler} errorText='Please provide an image.' />}
          <Input
            element='input'
            id='email'
            type='email'
            label='E-mail'
            validators={[VALIDATOR_EMAIL]}
            errorText='Please enter a valid email address.'
            onInput={inputHandler}
          />
          <Input
            element='input'
            id='password'
            type='password'
            label='Password'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid password with at least 5 characters.'
            onInput={inputHandler}
          />
          <Button type='submit' disabled={!formState.isValid}>
            LOGIN
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SIGN UP
        </Button>
      </Card>
    </>
  )
}

export default Auth
