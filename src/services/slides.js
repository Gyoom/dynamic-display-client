import axios from 'axios'

const baseUrl = import.meta.env.VITE_URL_SERVER + "/slides"

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getBySerieId = (id) => {
  const request = axios.get(baseUrl + '/serie/' + id)
  return request.then(response => response.data)
}

const createOne = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const removeOneById = (id) => {
  const request = axios.delete(baseUrl + '/' + id)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll,
  getBySerieId: getBySerieId,
  createOne: createOne,
  removeOneById : removeOneById
}