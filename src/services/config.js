import axios from 'axios'

const baseUrl = import.meta.env.VITE_URL_SERVER + "/config"

const get = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const change = (newConfig) => {
    const request = axios.post(baseUrl, newConfig)
    return request.then(response => response.data)
  }

export default { 
  get: get,
  change: change
}