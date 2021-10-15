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
    let data_length = data.CHILDREN.CHILD.length;
    let single = [];
    for(let i = 0; i<100 && i<data_length; i++){
        if(data.CHILDREN.CHILD[i].title != "Auto Draft"){     
            single[i] = data.CHILDREN.CHILD[i];
        }
    }
    console.log(single[1]);
    try{
        await Promise.all(single.map( async (element) =>  {
            let code = "";
            let first_name = "";
            let last_name = "";
            let nick_name = "";
            let gender = "";
            let home = "";
            let description = "";
            let wp_post_id = element.post_id.__text;
            let exit_status = "";
            let exit_notes = "";
            let date_archived = new Date("1970-01-01 08:00:00");
            let country = "";
            let post_date = new Date("2008-01-01 08:00:00");
            let birthday = new Date("1970-01-01 08:00:00");
            let sponsorship_in_dollars = 0;
            let in_undisclosed_country = false;
            let published = true;

            element.postmeta.forEach(meta =>{
                switch(meta.meta_key.__cdata){
                    case "nhu_code":
                        code = meta.meta_value.__cdata.toString();
                        break;
                    case "first_name":
                        first_name = meta.meta_value.__cdata.toString();
                        break;
                    case "last_name":
                        last_name = meta.meta_value.__cdata.toString();
                        break;
                    case "nick_name":
                        nick_name = meta.meta_value.__cdata.toString();
                        break;
                    case "gender":
                        gender = meta.meta_value.__cdata.toString();
                        break;
                    case "home":
                        home = meta.meta_value.__cdata.toString();
                        break;
                    case "description":
                        description = meta.meta_value.__cdata.toString();
                        break;
                    case "exit_status":
                        exit_status = meta.meta_value.__cdata.toString();
                        break;
                    case "exit_notes":
                        exit_notes = meta.meta_value.__cdata.toString();
                        break;
                    case "birthday":
                        try{
                        if(meta.meta_value.__cdata != ""){
                            birthday = parseInt(meta.meta_value.__cdata);
                            if(birthday >= 165043221278){
                                birthday = new Date("1970-01-01 08:00:00");
                            } else {
                                birthday = new Date(birthday);
                            }
                        }
                            birthday = birthday.toISOString();
                        } catch (err) {
                            console.error("encounted error: " + err + "caused by entry titled: " + element.title);
                        }
                        break;
                    case "sponsorship":
                        sponsorship_in_dollars = meta.meta_value.__cdata.toString();
                        break;
                    case "date_archived":
                        date_archived = new Date(meta.meta_value.__cdata);
                        date_archived = date_archived.toISOString();
                        break;
                    
                    
                }
            });


            if(exit_status == ""){
                exit_status = "still_active";
            }

            if(gender.toLowerCase() == "f"){
                gender = "female";
            } else {
                gender = "male";
            }

            if(country.toLowerCase() == "la"){
                in_undisclosed_country = true;
            } else {
                in_undisclosed_country = false;
            }

            if(country.toLowerCase() == "gw"){
                country = "gu";
            } else if(country.toLowerCase() == "sn"){
                country = "se";
            }

            if(element.status.__cdata =="auto-draft"){
                published = "auto_draft";
            } else {
                published = element.status.__cdata;
            }

            if(typeof date_archived == "undefined"){
                date_archived = "";
            }
            if(typeof element.post_date_gmt.__cdata != "undefined"){
                post_date = new Date(element.post_date_gmt.__cdata);
            }
            post_date = post_date.toISOString();

            if(home == ""){
                let regex = /[A-Za-z]{2,4}\d{1,2}/;
                console.log(code);
                home = code.match(regex)[0];
            }

            console.log("Querying on: " + home);
            let home_result = await strapi.query('home').find({home_id: home});
            console.log("Home Result: " + home_result[0].id);
            let home_id = home_result[0].id;
            console.log("this county id is: " + home_result[0].country.id);
            let home_country = home_result[0].country.id;
            console.log("This is " + home_id + " in " + home_country);
            console.log("wp_post_id is: " + wp_post_id);

            try{
                console.log(element.post_name.__cdata);
                strapi.services.child.create({
                    "child_id": code, //Required
                    "unique_id": code, //Required
                    "old_wp_post_id": wp_post_id,
                    "publish_status": published,
                    "first_name": first_name, //required
                    "last_name": last_name,
                    "birthday": birthday, // Date
                    "gender": gender, //male or female Required
                    "description": description,
                    "nick_name": nick_name,
                    "date_archived": date_archived, // Date
                    "exit_notes": exit_notes,
                    "in_undisclosed_country": in_undisclosed_country, //Bool Required
                    "total_sponsorship_dollars": sponsorship_in_dollars, //Number
                    "home": home_id, //home_id
                    "exit_status": exit_status,
                    "country" : home_country,
                    "wp_post_date_gmt": post_date // Date
                });
            } catch (err) {
                console.error("There was an error:" + err);
            }
            
            
        }));
    } catch(err){
        console.log(err);
    }
};

async function ImportChurches(data){
    let i = 1;
    console.log(data.CHURCHES.CHURCH.length);
    await Promise.all(data.CHURCHES.CHURCH.map( async (element) =>  {
        let code = "";
        let name = "";
        let url = "";
        let logo = ""; // Media
        let is_cma = false; //Bool
        let city = "";
        let state = "";
        let country = "";
        let lon = "";
        let lat = "";
        let zoom = 5;
        let homes = "";
        let description = "";
            

        console.log(i.toString());
        i++;
        element.postmeta.forEach(meta =>{
            switch(meta.meta_key.__cdata){
                case "nhu_code":
                    code = meta.meta_value.__cdata.toString();
                    break;
                case "name":
                    name = meta.meta_value.__cdata.toString();
                    break;
                case "country":
                    country = meta.meta_value.__cdata.toString();
                    break;
                case "latitude":
                    lat = meta.meta_value.__cdata.toString();
                    break;
                case "longitude":
                    lon = meta.meta_value.__cdata.toString();
                    break;
                case "zoom":
                    zoom = meta.meta_value.__cdata;
                    break;
                case "description":
                    description = meta.meta_value.__cdata.toString();
                    break;
                case "state":
                    state = meta.meta_value.__cdata.toString();
                    break;
                case "url":
                    url = meta.meta_value.__cdata.toString();
                    break;
                case "logo_url":
                    logo = meta.meta_value.__cdata.toString();
                    break;
                case "is_cma":
                    is_cma = (meta.meta_value.__cdata === 'true');
                    break;
                case "city":
                    city = meta.meta_value.__cdata.toString();
                    break;
                case "homes":
                    homes = meta.meta_value.__cdata.toString();
                    homes = homes.split(',');
                    break;
            }
        });

        console.log(element.title);
        console.log(code);
        console.log(element.post_id.__text);
        let results = await strapi.services.church.create({
            church_id: code.toString(), //required
            unique_id: code.toString(),
            old_wp_post_id: element.post_id.__text, //element.post_id.__text.toString(), //required
            //"name": "thing",//element.title,
            //"url": url,
            //"logo_url": logo, // Media
            //"is_cma": is_cma, //Bool
            // "city": city,
            // "state": state,
            // "country": country,
            // "latitude": lon,
            // "longitude": lat,
            // "zoom": zoom, //Number
            // "description": description,
        });


        if(typeof results.id != 'undefined' && homes.length > 0){
            await Promise.all(homes.map(async (home) => {

                console.log(results);
                
                let home_result = await strapi.query('home').find({home_id: home.toString()});
                if(typeof home_result != 'undefined'){
                    console.log(home_result);
                }
                if(typeof home_result[0].id != 'undefined'){

                    home_id = home_result[0].id;
                    console.log("This is " + home_id);
                    
                    // strapi.services.church_home_support.create({
                    //     church: "",
                    //     home:"",
                    // });
                }
            }));
                    
        }
    }));
};


module.exports = async () => {
    // Import Countries from .countryData.json in test-data directory
    // const country_json = require('../../test-data/.countryData.json');
    // ImportCountry(country_json);

    // Import Homes from .homeData.json in test-data directory
    // const home_json = require('../../test-data/.homeData.json');
    // ImportHomes(home_json);

    // Import Children from .childrenData.json in test-data directory
    // const children_json = require('../../test-data/.childData.json');
    // ImportChildren(children_json);

    // Import churches from .churchData.json in test-data directory
    // const churches_json = require('../../test-data/.churchData.json');
    // ImportChurches(churches_json);
    
};
