import { App } from '@core/globals'
import sgMail from '@sendgrid/mail'

// Maybe we can add something here later. For now, this suffices the need.
sgMail.setApiKey(App.Config.SENDGRID_API_KEY)

export default sgMail
