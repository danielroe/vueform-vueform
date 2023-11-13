import keys from 'lodash-es/keys'
import each from 'lodash-es/each'
import Validator from './../validator'

export default class exists extends Validator {
  get isAsync() {
    return true
  }

  get requestParams() {
    var params = {}

    each(this.attributes, (param, key) => {
      var requestParam = key

      if (!isNaN(key)) {
        requestParam = param
      }

      if (requestParam == 'debounce') {
        return
      }

      var el = this.form$.el$(requestParam)

      // set the element value or the param name itself
      params[keys(params).length] = el && key != 0 ? el.value : requestParam
    })

    return params
  }
  
  async check(value) {
    const name = this.element$.name
    const endpoint = this.form$.$vueform.config.endpoints.exists
    const method = typeof endpoint !== 'function' ? endpoint.method : null

    let res

    if (typeof endpoint === 'function') {
      res = await(endpoint(value, name, this.requestParams, this.element$, this.form$))
    } else {
      res = await this.form$.$vueform.services.axios.request({
        url: endpoint.url,
        method,
        [method.toLowerCase() === 'get' ? 'params' : 'data']: {
          params: this.requestParams,
          [name]: value,
          vueformFieldName: name,
          value,
          name,
        },
      })
    }

    return res.data
  }
}