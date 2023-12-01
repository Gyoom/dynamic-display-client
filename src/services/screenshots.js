import axios from 'axios'

const baseUrl = "http://localhost:4000/screenshots"

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll
}