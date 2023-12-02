import axios from 'axios'

const baseUrl = "http://localhost:4000/config"

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