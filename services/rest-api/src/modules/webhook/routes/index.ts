import '@core/declarations'
import { Request, Response, Router } from 'express'
import WebhookController from '@modules/webhook/controllers'
import { Wrap } from '@core/utils'

const webhookController = new WebhookController()
const router = Router()

router.get('/ping', (_req: Request, res: Response) => {
  return res.success()
})

router.get('/stripe', Wrap(webhookController.Stripe))

export const webhookRouter = router
