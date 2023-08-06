import axios from 'axios';

export default axios.interceptors.request.use(config => {
	return config;
});