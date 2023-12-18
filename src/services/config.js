import axios from 'axios'

const baseUrl = import.meta.env.VITE_URL_SERVER + "/api/config"

const get = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { 
  get: get
}