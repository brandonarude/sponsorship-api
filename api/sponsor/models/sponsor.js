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
        //Calculate last_name_first_name fields
        async beforeCreate(data){
            data.last_name_first_name = data.last_name + ", " + data.first_name;
        },

        async beforeUpdate(params, data){
            let first_name = "undefined";
            let last_name = "undefined";
            console.log(params);
            console.log(data);
            if(typeof data.last_name != 'undefined'){
                last_name = data.last_name;
            } else {
                console.log("querying last name");
                let last_name_result = await strapi.query('sponsor').findOne({id: params.id});
                console.log(last_name_result);
                if(typeof last_name_result != 'undefined' &&  typeof last_name_result.last_name != 'undefined'){
                    last_name = last_name_result.last_name;
                } else {
                    last_name = "undefined";
                }
            }

            if(typeof data.first_name != 'undefined'){
                first_name = data.first_name;
            }  else {
                console.log("querying first name");
                let first_name_result = await strapi.query('sponsor').findOne({id: params.id});
                console.log(first_name_result);
                if(typeof first_name_result != 'undefined' &&  typeof first_name_result.first_name != 'undefined'){
                    first_name = first_name_result.first_name;
                } else {
                    first_name = "undefined";
                }
            }

            data.last_name_first_name = last_name + ", " + first_name;
        }
    }

};
