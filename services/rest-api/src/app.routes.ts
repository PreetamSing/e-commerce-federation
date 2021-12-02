import '@core/declarations'
import { Router } from 'express'

import { webhookRouter } from '@modules/webhook/routes'

const router = Router()

router.use('/webhook', webhookRouter)

export const AppRoutes = router
