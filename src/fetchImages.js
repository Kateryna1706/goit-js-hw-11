import axios from 'axios';
let page = 0;
export const fetchImages = function (name) {
  page += 1;
  return axios
    .get(
      `https://pixabay.com/api/?key=36259505-7f3dd5b7540e269f4a04dc70a&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    )
};
