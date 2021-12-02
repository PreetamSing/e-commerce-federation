import Config, { ConfigInterface } from '@config'
import { Logger } from './logger'
import path from 'path'

// Database Models
import { UserModel } from '@models/user'

const config: ConfigInterface = Config()

// Export Global Variables
export { Logger }
export const App = {
  EXTENSION_ECOSYSTEM: path.extname(__filename) === '.js' ? 'js' : 'ts',
  Config: config,
  Models: {
    User: UserModel,
  },
  Database: null,
}
