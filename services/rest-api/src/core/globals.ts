import Config, { ConfigInterface } from '@config'
import { Logger } from './logger'
import { GetAclValues } from './utils'
import path from 'path'

// Database Models

const config: ConfigInterface = Config()

// Export Global Variables
export const Global: any = global
Global.Logger = Logger
Global.App = {
  EXTENSION_ECOSYSTEM: path.extname(__filename) === '.js' ? 'js' : 'ts',
  Http: {
    app: null,
  },
  ACL_VALUES: GetAclValues(),
  Config: config,
  Models: {},
}
