'use strict';

const { default: createStrapi } = require('strapi');

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

function ImportCountry(data){
    data.COUNTRIES.COUNTRY.forEach(element => {
        console.log(element.country_id);
        console.log(element.two_letter_code);
        console.log(element["Country Name"]);
        strapi.services.country.create({
            country_id: element.country_id.toString(),
            unique_id: element.country_id.toString(),
            is_undisclosed: false,
            two_letter_code: element.two_letter_code,
            country_name: element["Country Name"]
        });
        
    });
};

module.exports = async () => {
    // Import Countries from .countryData.json in root directory
    // let json = require('../../.countryData.json');
    // ImportCountry(json);
    
};
