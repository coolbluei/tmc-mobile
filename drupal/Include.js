export default class Include {

    constructor(data, includes) {
        this.data = data;
        this.includes = includes;
    }

    get = (label) => {
        const field = this.getField(label);
        if (!field instanceof Include) {
          return this.getStructuredData(field);
        }
    
        return field;
    }

    getImageUrl = (label, size) => {
        const imageField = this.getField(label);
        if (imageField) {
            const links = imageField.get('links');
            if (links && links.hasOwnProperty(size)) {
                return links[size].href;
            }
        }
    }

    getField = (label) => {
        let data = this.data;
        if(data instanceof Object) {
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
            if(data.relationships[label].data instanceof Array) {
                let items = [];
                for(const item of data.relationships[label].data) {
                    items.push(new Include(this.includes.find((e) => e.id === item.id), this.includes));
                }

                return items;
            }

            if(data.relationships[label].data === null) {
                return null;
            }
            
            return new Include(this.includes.find((e) => e.id === data.relationships[label].data.id), this.includes);
            }
        }
    
        // Otherwise, we found nothing and should clearly return the same.
        return null;
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

    getInclude = (id) => {
        // Look for an include with the field id.
        if (this.data.hasOwnProperty('included')) {
            return Object.assign(new Include(), this.data.included.find((e) => e.id === id));
        }
        return null;
    }
    
}