import { useState, useCallback, useRef, useEffect } from 'react'

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const activeHttpRequests = useRef([])
  const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    try {
      setIsLoading(true)
      // abort http requests if necessary, https://developer.mozilla.org/en-US/docs/Web/API/AbortController
      // Note that React 18 StrictMode renders all useEffects twice when in dev mode, potentially causing issues with AbortController.
      const httpAbort = new AbortController()
      activeHttpRequests.current.push(httpAbort)
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: httpAbort.signal,
      })
      const data = await response.json()
      // filter all request controllers and remove the controller used for this specific request
      // this way, abort controllers that are no longer needed will be removed
      activeHttpRequests.current = activeHttpRequests.current.filter((requestController) => requestController !== httpAbort)
      if (!response.ok) throw new Error(data.message)
      setIsLoading(false)
      return data
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
      throw error
    }
  }, [])
  const clearError = () => {
    setError(null)
  }
  // shuts down active requests if the page where the request came from is switched away from
  // ie, the user starts a fetch request, then moves away from the page
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort())
    }
  }, [])
  return { isLoading, error, sendRequest, clearError }
}
