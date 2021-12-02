import '@core/declarations'
import _ from 'lodash'

class PaginationHelper {
  async Paginate(inputs: {
    q?: string
    model: string
    populate?: any
    startIndex?: number
    itemsPerPage?: number
    query?: any
    sort?: any
    projection?: any
  }) {
    try {
      const {
        q,
        model,
        populate = null,
        startIndex = 1,
        itemsPerPage = App.Config.ITEMS_PER_PAGE,
        query = {},
        sort = { _id: 1 },
        projection = {},
      } = inputs

      const Model = eval(
        `App.Models.${model.split('-').map(_.capitalize).join('')}`
      )

      const skipCount: number = startIndex > 0 ? startIndex - 1 : 0

      const perPage =
        itemsPerPage > 0 ? itemsPerPage : App.Config.ITEMS_PER_PAGE

      // Wild card search will be handled by fuzzy-search helper
      if (q) {
        // Get wildcard search query
        const fuzzyQuery = { $text: { $search: q } }
        const fuzzyProjection = { confidence: { $meta: 'textScore' } }
        const fuzzySort = { confidence: { $meta: 'textScore' } }

        Object.assign(query, fuzzyQuery)
        Object.assign(projection, fuzzyProjection)
        Object.assign(sort, fuzzySort)
      }

      const totalItems = await Model.countDocuments(query)

      let items = []
      if (populate) {
        items = await Model.find(query, projection)
          .skip(skipCount)
          .limit(itemsPerPage)
          .sort(sort)
          .populate(populate)
          .lean()
      } else {
        items = await Model.find(query, projection)
          .skip(skipCount)
          .limit(itemsPerPage)
          .sort(sort)
          .lean()
      }

      return {
        totalItems,
        startIndex: skipCount + 1,
        itemsPerPage: perPage,
        items,
      }
    } catch (error) {
      Logger.error(error)
    }

    // On Error Return Null
    return null
  }
}

// All Done
export default new PaginationHelper()
