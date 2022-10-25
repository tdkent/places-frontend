import React, { useState, useCallback, useEffect } from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import Users from './user/pages/Users'
import NewPlace from './places/pages/NewPlace'
import UserPlaces from './places/pages/UserPlaces'
import MainNavigation from './shared/components/Navigation/MainNavigation'
import UpdatePlace from './places/pages/UpdatePlace'
import Auth from './user/pages/Auth'
import { AuthContext } from './shared/context/auth-context'
import './App.css'

// new react router syntax: wrap Route instead of standalone
// add exact keyword to only render the wrapped component at that route
// Router runs top down. Redirect catch-all directs any unspecified routes to the redirect location.
// Switch prevents router from continuing to evaluate subsequent lines if it encounters a matching route. Otherwise, router will always evaluate to the bottom and render the Redirect.

const App = () => {
  const [token, setToken] = useState(false)
  const [userId, setUserId] = useState('')

  const login = useCallback((uid, token, tokenExprDate) => {
    setToken(token)
    setUserId(uid)
    // Check to see if an expiration date is already stored, and create new date if not.
    // Note: jwt token expires in 2 days
    const tokenExpr = tokenExprDate || new Date(new Date().getTime() + 86400 * 2 * 1000)
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpr.toISOString(),
      })
    )
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    localStorage.removeItem('userData')
  }, [])

  // check local storage for token on reload and log the user back in if credentials are available
  useEffect(() => {
    // JSON.parse converts json strings back to regular JS data
    const storedData = JSON.parse(localStorage.getItem('userData'))
    // checks whether complete local storage data is available, and if token expiration date is in the future
    if (storedData && storedData.token && storedData.userId && new Date(storedData.expiration) > new Date()) {
      // forward stored expiration date to login() above to prevent overwrite on refresh
      login(storedData.userId, storedData.token, new Date(storedData.expiration))
    }
  }, [login])

  let routes

  if (token) {
    routes = (
      <Switch>
        <Route path='/' exact>
          <Users />
        </Route>
        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>
        <Route path='/places/new' exact>
          <NewPlace />
        </Route>
        <Route path='/places/:placeId' exact>
          <UpdatePlace />
        </Route>
        <Redirect to='/' />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path='/' exact>
          <Users />
        </Route>
        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>
        <Route path='/auth' exact>
          <Auth />
        </Route>
        <Redirect to='/auth' />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout }}>
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
