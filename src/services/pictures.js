import axios from 'axios'

const baseUrl = import.meta.env.VITE_URL_SERVER + "/pictures"

const getAll = (screenResolution) => {
  const request = axios.post(baseUrl, screenResolution)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll
}