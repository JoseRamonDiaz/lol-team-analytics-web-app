import React, { Component } from 'react';
const chatTextParser = require('./chat-text-parser');
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function initComponents(self){
    self.handleFindStats = self.handleFindStats.bind(self);
    self.handleChatTextChange = self.handleChatTextChange.bind(self);
    self.handleSummonerNameChange = self.handleSummonerNameChange.bind(self);
    self.handleRegionChange = self.handleRegionChange.bind(self);
    self.handleSeasonChange = self.handleSeasonChange.bind(self);
    Region = Region.bind(self);
    Season = Season.bind(self);
}

export default class SummonersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summonersList: [],
            regions: [],
            seasons: [],
            selectedRegion: 'Regions',
            selectedSeason: 'Seasons',
            chatText: '',
            summonerName: '',
        }
        fetch('api/regions').then(resp => resp.json())
        .then(fetchedRegions => this.setState({regions: fetchedRegions}));

        fetch('api/seasons').then(resp=> resp.json())
        .then(fetchedSeasons => this.setState({seasons: fetchedSeasons}));

        initComponents(this);
    }

    handleFindStats(event) {
        var summonersArray = chatTextParser.getSummoners(this.state.chatText, this.state.summonerName);
        var data = new FormData();
        data.append("summoners", JSON.stringify(summonersArray));
        data.append("season", this.state.selectedSeason);
        data.append("region", this.state.selectedRegion);

        var myInit = {
            method: 'POST',
            body: data
        }

        fetch('/api/summoners/stats', myInit)
            .then(resp => resp.json())
            .then(newSummonersList => this.setState({ summonersList: newSummonersList }));

        event.preventDefault();
    }

    handleChatTextChange(event) {
        this.setState({ chatText: event.target.value });
    }

    handleSummonerNameChange(event) {
        this.setState({ summonerName: event.target.value });
    }

    handleRegionChange(event){
        this.setState({selectedRegion: event.target.innerText});
        //this is added because button in form launchs the onsubmit
        event.preventDefault();
    }

    handleSeasonChange(event){
        this.setState({selectedSeason: event.target.innerText});
        //this is added because button in form launchs the onsubmit
        event.preventDefault();
    }

    render() {
        const regions = this.state.regions;
        const listRegions = regions.map((region) => <Region key={region} value={region}/>);

        const seasons = this.state.seasons;
        const listSeasons = seasons.map((season) => <Season key={season} value={season}/>);

        const summoners = this.state.summonersList;
        const listSummoners = summoners.map((sumoner) =>
            <Summoner key={sumoner.name} name={sumoner.name} champs={sumoner.champs} />
        );

        return (
            <div>
                <div id="query">
                    <form onSubmit={this.handleFindStats} >
                        <div className="form-group">
                            <label htmlFor="chatText">Chat text</label>
                            <textarea id="chatText" className="form-control" value={this.state.chatText} onChange={this.handleChatTextChange} rows="10" cols="50" placeholder="Insert yout chat text here"></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="summonerName">Your summoner name</label>
                            <input id="summonerName" className="form-control" value={this.state.summonerName} onChange={this.handleSummonerNameChange} type="text" placeholder="Insert yout summoner name here"></input>
                        </div>
                        <div className="form-group">
                            <div className="dropdown">
                                <button className="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {this.state.selectedRegion}
                                </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    {listRegions}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="dropdown">
                                <button className="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {this.state.selectedSeason}
                                </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    {listSeasons}
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary" type="submit" >Find</button>
                    </form>
                </div>
                <div id="result">
                    <div>
                        {listSummoners}
                    </div>
                </div>
            </div>
        );
    }
}
 
function Region(props){
    return (
        <button onClick={this.handleRegionChange} className="dropdown-item">{props.value}</button>
    );
}

function Season(props){
    return (
        <button onClick={this.handleSeasonChange} className="dropdown-item">{props.value}</button>
    );
}

function Champ(props) {
    return (
        <tr>
            <td>{props.name}</td>
            <td>{props.wins}</td>
            <td>{props.losses}</td>
            <td>{props.winRatio}</td>
        </tr>
    );
}

function Summoner(props) {
    const champs = props.champs;
    let champsList ;
    if(champs.length > 0){
        champsList = champs.map((champ) =>
            <Champ key={champ.name} name={champ.name} wins={champ.wins} losses={champ.losses} winRatio = {champ.winRatio}/>
        );
    }else{
        champsList = <td colSpan="4">No ranked games data</td>
    }
    
    return (
        <div>
            <br/>
            <table class="table">
                <thead>
                    <tr><th id="summoner-name">{props.name}</th></tr>
                    <tr>
                        <th>Champ</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>WinRatio</th>
                    </tr>
                </thead>
                <tbody>
                    {champsList}
                </tbody>
            </table>
        </div>
    );
}