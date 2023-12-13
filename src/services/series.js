import axios from 'axios'

const baseUrl = import.meta.env.VITE_URL_SERVER + "/series"

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getDefault = () => {
  const request = axios.get(baseUrl + '/default')
  return request.then(response => response.data)
}

const getOneById = (id) => {
    const request = axios.get(baseUrl + '/' + id)
    return request.then(response => response.data)
}

export default { 
  getAll: getAll,
  getDefault : getDefault,
  getOneById : getOneById
}