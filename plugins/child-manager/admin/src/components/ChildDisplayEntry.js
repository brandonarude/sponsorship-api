import React, {Component} from 'react';
import "./styles/ChildManager.css"

class ChildDisplayEntry extends Component{
    constructor(props){
        super(props);
        this.state={
            recordId: props.recordId,
            childCode: props.childId,
            homeId: props.homeRecordId,
            homeCode: props.homeCode
        };
    }

    

    render(){
        return(
            <div className="row" key={this.state.recordId}>
                <div className="photoContainer col-sm">
                    <div className="entryPhoto"></div>
                </div>
                <div className="nameContainer col-sm"><a href={"http://localhost:1337/children/"+this.state.recordId} className="recordLink">{this.state.childCode}</a></div>
                <div className="codeContainer col-sm">
                    <p className="entryChildId"></p>
                </div>
                <div className="ageContainer col-sm">
                    <p className="entryAge"></p>
                </div>
                <div className="countryContainer col-sm">
                    <div className="countryFlag"></div>
                </div>
                <div className="homeContainer col-sm"><a href={"http://localhost:1337/homes/"+this.state.homeId} className="entryHome">{this.state.homeCode}</a></div>
                <div className="sponsorshipContainer col-sm">
                    <p className="entrySponsorshipAmount"></p>
                </div>
            </div>
        )
    }
}
export default ChildDisplayEntry;