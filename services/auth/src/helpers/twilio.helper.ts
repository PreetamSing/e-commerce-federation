import client from 'twilio'

import { App } from '@core/globals'

const TwilioHelper = client(
  App.Config.TWILIO_ACCOUNT_SID,
  App.Config.TWILIO_AUTH_TOKEN
)

export default TwilioHelper
