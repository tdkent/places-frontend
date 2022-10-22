import { createContext } from 'react'

// creates a context object
// object is further defined and then wrapped to project hierarchy in App.js
// in App.js, login and logout are combined with a isLoggedIn boolean state, ie:
// const login = useCallback(() => { setIsLoggedIn(true) }, []);
// why do we use useCallback here? The function login is now memoized (cached), and will not be recreated by React unless it needs to be.
// use in conjunction with useContext hook, ie:
// const auth = useContext(AuthContext)
// we now have access to auth.isLoggedIn, auth.login, auth.logout
// these can be used to get and set state throughout the entire project

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  login: () => {},
  logout: () => {},
})
