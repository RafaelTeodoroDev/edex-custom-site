import { create } from 'axios';

export default create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})