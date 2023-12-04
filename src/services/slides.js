import axios from 'axios'

const baseUrl = import.meta.env.VITE_URL_SERVER + "/slides"

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const post = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const remove = (deletedObjectId) => {
  const request = axios.delete(baseUrl + '/' + deletedObjectId)
  return request.then(response => response.data)
}

const updateOrder = (newOrder) => {
  const request = axios.put(baseUrl + '/order', newOrder)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll,
  post  : post,
  remove : remove,
  updateOrder : updateOrder
}