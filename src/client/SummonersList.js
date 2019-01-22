import React, { Component } from 'react';
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
        this.chatJoinText = " se unió a la sala";
    }

    handleFindStats(event) {
        var summonersArray = this.getSummoners();
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

    getSummoners() {
        var summonersNamesArray = [];
        var lines = this.state.chatText.split(/\r*\n/);

        for (var i = 0; i < lines.length; i++) {
            if (this.isRoomJoinText(lines[i])) {
                var summonerName = this.getSummonerName(lines[i]);
                if(summonerName.toLowerCase() !== this.state.summonerName.toLowerCase()){
                    summonersNamesArray.push(summonerName);
                }
            }
        }

        return summonersNamesArray;
    }

    getSummonerName(line) {
        return line.replace(this.chatJoinText, '');
    }

    isRoomJoinText(line) {

        if (line.indexOf(this.chatJoinText) > -1) {
            return true;
        }
        return false;
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
    const champsList = champs.map((champ) =>
        <Champ key={champ.name} name={champ.name} wins={champ.wins} losses={champ.losses} winRatio = {champ.winRatio}/>
    );
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