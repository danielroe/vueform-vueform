import BaseElement from './BaseElement'
import NestedElementLayout from './../components/NestedElementLayout'
import HasElements from './HasElements'

export default {
  mixins: [BaseElement, HasElements],
  components: {
    NestedElementLayout,
  },
  data() {
    return {
      /**
       * Child components.
       * 
       * @type {object}
       * @default {}
       */
      children$: {},

      /**
       * Element slots.
       * 
       * @type {object}
       * @default {
       *  "children": {
       *    "description": "Contains the children of the element.",
       *    "attributes": {
       *      "el$": {"type": "object", "description": "The element component."}
       *    }
       *  }
       * }
       */
      slots: {
        label: null,
        children: null,
        before: null,
        between: null,
        description: null,
        error: null,
        after: null,
      },
    }
  },
  computed: {
    /**
     * The value of the element.
     * 
     * @type {any}
     */
    value: {
      get() {
        return this.data[this.name]
      },
      set(value) {
        throw new Error('A nested element\'s value cannot be set directly. Use .update() or .load() method.')
      }
    },

    /**
     * An object containing the element `name` as a key and its `value` as value.
     * 
     * @type {object}
     */
    data() {
      var data = {}

      _.each(this.children$, (element$) => {
        data = Object.assign({}, data, element$.data)
      })

      return {
        [this.name]: data
      }
    },

    /**
     * An object containing the element `name` as a key and its `value` as value only if the element is available and `submit` is not set to `false`.
     * 
     * @type {object}
     */
    filtered() {
      if (!this.available || !this.submit) {
        return {}
      }

      var filtered = {}

      _.each(this.children$, (element$) => {
        filtered = Object.assign({}, filtered, element$.filtered)
      })

      return {
        [this.name]: filtered
      }
    },

    /**
     * Helper property used to pass a data object to children.
     * 
     * @type {object}
     * @ignore
     */
    heritage() {
      return {
        available: this.available,
        path: this.path
      }
    },

    /**
     * Returns the list of elements which should be required by the component.
     * 
     * @returns {array}
     * @ignore
     */
    elements_() {
      return _.map(_.keys(_.keyBy(this.schema.schema, 'type')), (item) => {
        return item.replace('-', '')
      })
    },

    /**
     * Returns the list of components which should be required by the component.
     * 
     * @returns {array}
     * @ignore
     */
    components_() {
        var components = []

        _.each(this.schema.schema, (element) => {
          if (element.component && typeof element.component == 'string') {
            components.push(element.component)
          }
        })

        return components
    },
  },
  methods: {

    /**
     * Loads data for element or clears the element if the element's key is not found in the `data` object.
     *
     * @public
     * @param {object} data an object containing data for the element using its **name as key**
     * @returns {void}
     */
    load(data) {
      if (data === undefined || data[this.name] === undefined) {
        return
      }

      _.each(this.children$, (element$) => {
        element$.load(data[this.name])
      })
    },

    /**
     * Updates the element's value.
     *
     * @public
     * @param {any} value the value to be set for the element
     * @returns {void}
     */
    update(value) {
      _.each(this.children$, (element$) => {
        if (value[element$.name] === undefined) {
          return
        }
        
        element$.update(value[element$.name])
      })
    },

    /**
     * Resets the element to it's default state.
     *
     * @public
     * @returns {void}
     */
    reset() {
      _.each(this.children$, (element$) => {
        element$.reset()
      })
    },

    /**
     * Clears the value of the element.
     *
     * @public
     * @returns {void}
     */
    clear() {
      _.each(this.children$, (element$) => {
        element$.clear()
      })
    },

    /**
     * Inits the element.
     * 
     * @private 
     * @returns {void}
     */
    $_initElement() {
      // nothing to do
    },
  },
}