import {config} from 'dotenv';

config()

export const PORT = process.env.PORT || 3000
export const DB_USER = process.env.DB_USER || 'user_reniec'
export const DB_PASSWORD = process.env.DB_PASSWORD || '(-ZhL#9?9I5O'
export const DB_HOST = process.env.DB_HOST || '50.62.220.142'
export const DB_DATABASE = process.env.DB_DATABASE || 'reniecsunat'
export const DB_PORT = process.env.DB_PORT || 3306


