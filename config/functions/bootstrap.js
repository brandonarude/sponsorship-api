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

async function ImportHomes(data){
    let i = 1;
    console.log(data.HOMES.HOME.length);
    await Promise.all(data.HOMES.HOME.map( async (element) =>  {
        let lat = "";
        let lon = "";
        let zoom = 5;
        let sort_key = "";
        let undisclosed = "";
        let child_count = 0;
        let public_location = "";
        let country = "";
        let home_name = "";

        console.log(i.toString());
        i++;
        element.postmeta.forEach(meta =>{
            switch(meta.meta_key.__cdata){
                case "latitude":
                    lat = meta.meta_value.__cdata.toString();
                    break;
                case "longitude":
                    lon = meta.meta_value.__cdata.toString();
                    break;
                case "public_location":
                    public_location = meta.meta_value.__cdata.toString();
                    break;
                case "country":
                    country = meta.meta_value.__cdata.toString();
                    break;
                case "zoom":
                    zoom = meta.meta_value.__cdata.toString();
                    break;
                case "child_count":
                    child_count = meta.meta_value.__cdata.toString();
                    break;
                case "sort_key":
                    sort_key = meta.meta_value.__cdata.toString();
                    break;
                case "name":
                    home_name = meta.meta_value.__cdata.toString();
                    break;
            }
        });

        if(country.toLowerCase() == "la"){
            undisclosed = true;
        } else {
            undisclosed = false;
        }

        let country_id = ""
        if(country.toLowerCase() == "gw"){
            country = "gu";
        } else if(country.toLowerCase() == "sn"){
            country = "se";
        }

        let country_result = await strapi.query('country').find({two_letter_code: country});
        console.log(element.post_name.__cdata + ", " + sort_key +", " + home_name +", " + country+", "+lat+", "+lon+", "+zoom+", "+public_location);
        country_id = country_result[0].id;
        console.log("This is " + country_id, country_result[0].country_name);

        console.log(element.post_name.__cdata);
        strapi.services.home.create({
            "home_id": element.post_name.__cdata,
            "unique_id": element.post_name.__cdata,
            "name": element.post_name.__cdata,
            "latitude": lat,
            "longitude": lon,
            "zoom": zoom,
            "sort_key": sort_key,
            "in_undisclosed_country": undisclosed,
            "child_count": child_count,
            "description": element.description,
            "public_location": public_location,
            "country": country_id,
            "home_name": home_name
        });
        
    }));
};

async function ImportChildren(data){
    let i = 1;
    console.log(data.CHILDREN.CHILD.length);
    // await Promise.all(data.HOMES.HOME.map( async (element) =>  {
    //     let lat = "";
    //     let lon = "";
    //     let zoom = 5;
    //     let sort_key = "";
    //     let undisclosed = "";
    //     let child_count = 0;
    //     let public_location = "";
    //     let country = "";
    //     let home_name = "";

    //     console.log(i.toString());
    //     i++;
    //     element.postmeta.forEach(meta =>{
    //         switch(meta.meta_key.__cdata){
    //             case "latitude":
    //                 lat = meta.meta_value.__cdata.toString();
    //                 break;
    //             case "longitude":
    //                 lon = meta.meta_value.__cdata.toString();
    //                 break;
    //             case "public_location":
    //                 public_location = meta.meta_value.__cdata.toString();
    //                 break;
    //             case "country":
    //                 country = meta.meta_value.__cdata.toString();
    //                 break;
    //             case "zoom":
    //                 zoom = meta.meta_value.__cdata.toString();
    //                 break;
    //             case "child_count":
    //                 child_count = meta.meta_value.__cdata.toString();
    //                 break;
    //             case "sort_key":
    //                 sort_key = meta.meta_value.__cdata.toString();
    //                 break;
    //             case "name":
    //                 home_name = meta.meta_value.__cdata.toString();
    //                 break;
    //         }
    //     });

    //     if(country.toLowerCase() == "la"){
    //         undisclosed = true;
    //     } else {
    //         undisclosed = false;
    //     }

    //     let country_id = ""
    //     if(country.toLowerCase() == "gw"){
    //         country = "gu";
    //     } else if(country.toLowerCase() == "sn"){
    //         country = "se";
    //     }

    //     let country_result = await strapi.query('country').find({two_letter_code: country});
    //     console.log(element.post_name.__cdata + ", " + sort_key +", " + home_name +", " + country+", "+lat+", "+lon+", "+zoom+", "+public_location);
    //     country_id = country_result[0].id;
    //     console.log("This is " + country_id, country_result[0].country_name);

    //     console.log(element.post_name.__cdata);
    //     strapi.services.home.create({
    //         "home_id": element.post_name.__cdata,
    //         "unique_id": element.post_name.__cdata,
    //         "name": element.post_name.__cdata,
    //         "latitude": lat,
    //         "longitude": lon,
    //         "zoom": zoom,
    //         "sort_key": sort_key,
    //         "in_undisclosed_country": undisclosed,
    //         "child_count": child_count,
    //         "description": element.description,
    //         "public_location": public_location,
    //         "country": country_id,
    //         "home_name": home_name
    //     });
        
    // }));
};


module.exports = async () => {
    // Import Countries from .countryData.json in test-data directory
    // const country_json = require('../../test-data/.countryData.json');
    // ImportCountry(country_json);

    // Import Homes from .homeData.json in test-data directory
    // const home_json = require('../../test-data/.homeData.json');
    // ImportHomes(home_json);

    // Import Children from .childrenData.json in test-data directory
    const children_json = require('../../test-data/.childData.json');
    ImportChildren(children_json);
    
};
