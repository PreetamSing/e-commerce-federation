import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

const requestValidator = async (DTOClass, requestProperties): Promise<any> => {
  const user = plainToClass(DTOClass, requestProperties)
  const validationErrors = await validate(user)
  if (validationErrors.length > 0) {
    const errors = validationErrors.map((u) => {
      const obj = {
        property: u.property,
        error: u.constraints,
      }
      return obj
    })
    return errors
  }
  return null
}
export default requestValidator
