import _ from 'lodash'
import { dateResolver } from './date'

export const customScalarResolvers = _.merge(dateResolver)
