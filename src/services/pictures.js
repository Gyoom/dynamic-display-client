import axios from 'axios'

const baseUrl = import.meta.env.VITE_URL_SERVER + "/pictures"

const getOneById = (id) => {
  const request = axios.get(baseUrl + '/' + id)
  return request.then(response => response.data)
}

export default { 
  getOneById: getOneById
}