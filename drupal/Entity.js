import Include from './Include';

export default class Entity {

  constructor(data) {
    this.data = data.data;
    this.included = data.included;
  };

  getImageUrlFromMedia = (label, size) => {
    const mediaField = this.get(label);
    if (mediaField instanceof Include) {
      return  mediaField.getImageUrl('field_media_image', size);
    }
  }

  getField = (label) => {
    let data = this.data;
    if(data.hasOwnProperty('data')) {
      data = data.data;
    }
    if(data.hasOwnProperty(label)) {
      return data[label];
    }
    // Check in attributes first.
    if (data.hasOwnProperty('attributes') &&
      data.attributes.hasOwnProperty(label)) {
      return data.attributes[label];
    }
    // Look for the original ID for the provided field label.
    if (data.hasOwnProperty("relationships") &&
      data.relationships.hasOwnProperty(label)) {
      // Watch out for array of options.
      return data.relationships[label];
    }

    // Otherwise, we found nothing and should clearly return the same.
    return null;
  }

  getInclude = (id) => {
    // Look for an include with the field id.
    if (this.included instanceof Array) {
      return new Include(this.included.find((e) => e.id === id), this.included);
    }
    return null;
  }

  // Starting point to get the proper included content.
  get = (label) => {
    const field = this.getField(label);
    if (field && field.hasOwnProperty('data') && field.data !== null) {
      return this.getStructuredData(field.data);
    }

    return field;
  }

  getFirst = (label) => {
    const values = this.get(label);

    if(values instanceof Array) {
      return values[0];
    }

    return values;
  }

  // Heavy lifting to recursively get all data and the associated includes based on the Drupal entity.
  getStructuredData = (data) => {
    if (data instanceof Array) {
      if(data.length === 0) {
        return data;
      }
      // When we have an Array, we need to build an Array of results.
      let results = [];
      data.forEach(value => {
        // Recurse back through with the value.
        results.push(this.getStructuredData(value));
      })
      return results;
    }

    if(data instanceof Object && data.hasOwnProperty('id')) {
      const include = this.getInclude(data.id);

      if(include.hasOwnProperty('relationships')) {
        for(const fieldName in include.relationships) {

          let fieldData = null;

          if(include.relationships[fieldName] instanceof Array) {
            fieldData = include.relationships[fieldName];
          } else {
            fieldData = include.relationships[fieldName].data;
          }

          include.relationships[fieldName].included = this.getStructuredData(fieldData);
        }
      }

      return include;
    }

    return data;
  }

  static parseTypeBundle = (value) => {
    const divider = '--';

    const values = value.split(divider);

    return {
      type: values[0],
      bundle: values[1]
    };
  }
}