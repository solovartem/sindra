import axios from 'axios';
import { env } from '../../config';

const instance = axios.create({ baseURL: `${env.TABLE_API}/table` });

export default instance;
