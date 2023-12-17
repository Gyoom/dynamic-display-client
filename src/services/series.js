import axios from 'axios'

const baseUrl = import.meta.env.VITE_URL_SERVER + "/series"

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getOneById = (id) => {
  const request = axios.get(baseUrl + '/' + id)
  return request.then(response => response.data)
}

const createOne = (newSerie) => {
  const request = axios.post(baseUrl, newSerie)
  return request.then(response => response.data)
}

const addSlide = (serieId, newSerieSlide) => {
  const request = axios.put(baseUrl + '/addSlides/' + serieId, newSerieSlide)
  return request.then(response => response.data)
}

const removeOneById = (id) => {
  const request = axios.delete(baseUrl + '/' + id)
  return request.then(response => response.data)
}

const removeSlide = (serieId, slideId) => {
  const request = axios.put(baseUrl + '/removeSlides/' + serieId, slideId)
  return request.then(response => response.data)
}

const updateSlidesOrder = (serieId, newOrder) => {
  const request = axios.put(baseUrl + '/updateOrder/' + serieId, newOrder)
  return request.then(response => response.data)
}

const updateParams = (serieId, newParams) => {
  const request = axios.put(baseUrl + '/updateParams/' + serieId, newParams)
  return request.then(response => response.data)
}


export default { 
  getAll: getAll,
  getOneById: getOneById,
  createOne: createOne,
  addSlide: addSlide,
  removeOneById: removeOneById,
  removeSlide: removeSlide,
  updateSlidesOrder: updateSlidesOrder,
  updateParams: updateParams
}