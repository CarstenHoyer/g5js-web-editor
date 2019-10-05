import { Router } from 'express'
import { renderIndex } from '../views/index'

const router = new Router()

router.get('/', (req, res) => {
  res.send(renderIndex())
})

export default router
