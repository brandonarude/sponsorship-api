import React, {Component} from 'react';
import "./styles/ChildManager.css"

class ChildDisplayEntry extends Component{
    constructor(props){
        super(props);
        this.state={
            recordId: props.data.recordId,
            childCode: props.data.childCode,
            childFirstName: props.data.childFirstName,
            homeId: props.data.homeId,
            homeCode: props.data.homeCode,
            birthday: props.data.birthday,
            totalSponsorships: props.data.totalSponsorships,
            totalSponsorshipDollars: props.data.totalSponsorshipDollars,
            country: props.data.country,
            country_name: props.data.country_name,
            age: function(){
                let today = new Date();
                let birthDate = new Date(this.birthday);
                let age_now = today.getFullYear() - birthDate.getFullYear();
                let monthDiff = today.getMonth() - birthDate.getMonth();
                if(monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())){
                    age_now--;
                }
                return age_now;
            },
        };
        console.log(this.state.age());
    }

    

    render(){
        return(
            <th className="row recordEntry">
                <tr className="photoContainer col-sm">
                    <div className="entryPhoto"></div>
                </tr>
                <tr className="nameContainer col-sm">
                    <a href={strapi.backendURL+"/children/"+this.state.recordId} className="recordLink">{this.state.childFirstName}</a>
                </tr>
                <tr className="codeContainer col-sm">
                    <a className="entryChildId" href={strapi.backendURL+"/children/"+this.state.recordId}>{this.state.childCode}</a>
                </tr>
                <tr className="ageContainer col-sm">
                    <p className="entryAge">{this.state.age()}</p>
                </tr>
                <tr className="countryContainer col-sm">
                    <a className="countryLink" href={strapi.backendURL + "/countries/"+this.state.country}>
                        <div className="countryFlag"></div>
                        <p className="countryName">{this.state.country_name}</p>
                    </a>
                </tr>
                <tr className="homeContainer col-sm"><a href={strapi.backendURL + "/homes/"+this.state.homeId} className="entryHome">{this.state.homeCode}</a></tr>
                <tr className="totalSponsorshipsContainer col-sm">
                    <p className="entryTotalSponsorships">{this.state.totalSponsorships}</p>
                </tr>
                <tr className="sponsorshipAmountContainer col-sm">
                    <p className="entrySponsorshipAmount">{this.state.totalSponsorshipDollars}</p>
                </tr>
            </th>
        )
    }
}
export default ChildDisplayEntry;