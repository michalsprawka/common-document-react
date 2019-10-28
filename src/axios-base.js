import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:1338/'
    // baseURL: 'https://common-document.herokuapp.com/'
});

export default instance;