import app from './app'
import { createServer } from 'http'
import Router from "@koa/router";


const server = createServer(app.callback())

server.listen(3000, () => {
    console.log('Server is running on port 3000')
})