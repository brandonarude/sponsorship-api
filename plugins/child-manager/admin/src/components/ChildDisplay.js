import React, {Component} from 'react';
import axios from 'axios';
import ChildDisplayEntry from "./ChildDisplayEntry.js";
import "./styles/ChildManager.css";

class ChildDisplay extends Component{
    constructor(props){
        super(props);
        this.state={
            children: [],
            loading: true,
            numberToDisplay: 10,
            recordCursor: 0,
        };
        this.updateNumberToDisplay = this.updateNumberToDisplay.bind(this);
        this.retrieveChildren = this.retrieveChildren.bind(this);
        
        
    }

    updateNumberToDisplay(event){
        this.setState({numberToDisplay: parseInt(event.target.value)});
    }

    retrieveChildren = async () => {
        console.log(this.state.numberToDisplay);
        let response = await axios.post("http://localhost:1337/graphql", {
            query: `
          query {
            children(limit:`+this.state.numberToDisplay+`){
              id,
              child_code,
              first_name,
              home{
                id,
                home_id
              },
              birthday,
              total_sponsorships,
              total_sponsorship_dollars,
              country{
                id,
                country_name
              }
            }
          }`,
          });
          console.log(this.state.numberToDisplay);
        let responseChildren = [];
        for(let i = 0; i<this.state.numberToDisplay && i<response.data.data.children.length; i++){
            responseChildren[i] = response.data.data.children[i];
        }
        this.state.loading = false;
        this.setState({ 
            children: responseChildren,
        })
    }

    componentDidMount(){
        this.retrieveChildren();

    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.numberToDisplay != prevState.numberToDisplay){
            this.retrieveChildren();
        }
    }

    render(){
        let content = [];
        if(this.state.loading === true){
            content[0] = <tr><th key="1">loading</th></tr>;
        }else{
            content[0];
            let i = 0;
            this.state.children.forEach((child) => {
                let data = {
                    recordId: child.id,
                    childCode: child.child_code,
                    childFirstName: child.first_name,
                    homeId: child.home.id,
                    homeCode: child.home.home_id,
                    birthday: child.birthday,
                    totalSponsorships: child.total_sponsorships,
                    totalSponsorshipDollars: child.total_sponsorship_dollars,
                    country: child.country.id,
                    country_name: child.country.country_name,
                }
                content[i] = <ChildDisplayEntry key={child.id} data={data}/>
                i++
            })
        }
        return (
            <div>
                <h1>Hello</h1>
                <table className="container recordEntryContainer">
                    <tr className="row">
                        <th className="dataHeader col-sm align-middle">Photo</th>
                        <th className="dataHeader col-sm">Name</th>
                        <th className="dataHeader col-sm">Code</th>
                        <th className="dataHeader col-sm">Age</th>
                        <th className="dataHeader col-sm">Country</th>
                        <th className="dataHeader col-sm">Home</th>
                        <th className="dataHeader col-sm">Total Sponsors</th>
                        <th className="dataHeader col-sm">Amount Sponsored</th>
                    </tr>
                    {content}
                </table>
                <div className="optionsContainer">
                    <label for="numberOfRecords">Please choose number of children to display</label>
                    <select name="numberOfRecords" id="numberOfRecords" onChange={this.updateNumberToDisplay}>
                        <option value='10'>10</option>
                        <option value='25'>25</option>
                        <option value='50'>50</option>
                        <option value='100'>100</option>
                    </select>
                </div>
            </div>
        )
    }
}
export default ChildDisplay;