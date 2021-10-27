import React, {Component} from 'react';
import axios from 'axios';
import ChildDisplayEntry from "./ChildDisplayEntry.js";
import "./styles/ChildManager.css";
//const dotenv = require('dotenv');

class ChildDisplay extends Component{
    constructor(props){
        //dotenv.config();
        super(props);
        this.state={
            children: [],
            loading: true
        };
    }

    componentDidMount(){
        const retrieveChild = async () => {
            let response = await axios.get('http://localhost:1337/children');
            let responseChildren = [];
            for(let i = 0; i<10 && i<response.data.length; i++){
                responseChildren[i] = response.data[i];
            }
            this.state.loading = false;
            this.setState({ 
                children: responseChildren,
            })
        }

        let response = retrieveChild();
        console.log(response);
        console.log(this.state.children);
        console.log("here");

    }

    

    render(){
        console.log(this.state.loading);
        //console.log(process.env.API_URL);
        let content = [];
        if(this.state.loading === true){
            console.log("still loading");
            content[0] = <p key="1">loading</p>;
        }else{
            content[0];
            let i = 0;
            this.state.children.forEach((child) => {
                console.log(child.id);
                content[i] = <ChildDisplayEntry childCode={child.child_id} recordId={child.id} homeId={child.home.id} homeCode={child.home.home_id}/>
                console.log(content[i]);
                i++
            })
        }
        return (
            <div>
                <h1>Hello</h1>
                <div className="container">
                    {console.log("rendering with " + this.state.loading)}
                    {content}
                </div>
            </div>
        )
    }
}
export default ChildDisplay;