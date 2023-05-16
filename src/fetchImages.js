import axios from 'axios';

export const fetchImages = function (name, page, perPage) {
  return axios.get(
    `https://pixabay.com/api/?key=36259505-7f3dd5b7540e269f4a04dc70a&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
};
