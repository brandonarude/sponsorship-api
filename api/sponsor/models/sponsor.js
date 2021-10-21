'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {

    /*
     * Trigger before sponsor creation
     */
    lifecycles : {
        async beforeCreate(data){
            data.last_name_first_name = data.last_name + ", " + data.first_name;
        }
    }

};
