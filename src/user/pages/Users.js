import React, { useEffect, useState } from 'react'

import UsersList from '../components/UsersList'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [users, setUsers] = useState([])
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await sendRequest(`http://localhost:4000/api/users`)
        setUsers(data)
      } catch (error) {
        console.log(error)
      }
    }
    getUsers()
  }, [sendRequest]) // sendRequest is a dependency of useEffect since it is coming from outside the useEffect function. Note that is why useCallback is wrapped around useHttpClient hook, to prevent an infinite loop of sendRequest firing.

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      <UsersList items={users} />
    </>
  )
}

export default Users
