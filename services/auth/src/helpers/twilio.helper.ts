import client from 'twilio'

import { App } from '@core/globals'

class TwilioHelper {
  twilio = client(App.Config.TWILIO_ACCOUNT_SID, App.Config.TWILIO_AUTH_TOKEN)

  async SendMessage(input: { body: string; to: string }): Promise<void> {
    const { body, to } = input
    await this.twilio.messages.create({
      body,
      messagingServiceSid: App.Config.TWILIO_MESSAGING_SERVICE_SID,
      to,
    })
  }
}

export default new TwilioHelper()
