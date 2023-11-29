import axios from 'axios'

const baseUrl = "http://localhost:4000/config"

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const post = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll,
  post  : post
}