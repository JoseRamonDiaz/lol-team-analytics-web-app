import React, { Component } from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default class SummonersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summonersList: [],
            chatText: '',
            summonerName: '',
        }
        this.handleFindStats = this.handleFindStats.bind(this);
        this.handleChatTextChange = this.handleChatTextChange.bind(this);
        this.handleSummonerNameChange = this.handleSummonerNameChange.bind(this);
        this.chatJoinText = " se unió a la sala";
    }

    handleFindStats(event) {
        var summonersArray = this.getSummoners();
        console.log(summonersArray);

        var data = new FormData();
        data.append("summoners", JSON.stringify(summonersArray));

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
        console.log('text area lines: ' + lines.length);

        for (var i = 0; i < lines.length; i++) {
            console.log('line ' + i + ' ' + lines[i]);
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

    render() {
        const summoners = this.state.summonersList;
        const listSummoners = summoners.map((sumoner) =>
            <Summoner key={sumoner.name} name={sumoner.name} champs={sumoner.champs} />
        );

        return (
            <div>
                <div id="query">
                    <form onSubmit={this.handleFindStats} >
                        <div class="form-group">
                            <label for="chatText">Chat text</label>
                            <textarea id="chatText" class="form-control" value={this.state.chatText} onChange={this.handleChatTextChange} rows="10" cols="50" placeholder="Insert yout chat text here"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="summonerName">Your summoner name</label>
                            <input id="summonerName" class="form-control" value={this.state.summonerName} onChange={this.handleSummonerNameChange} type="text" placeholder="Insert yout summoner name here"></input>
                        </div>
                        <button class="btn btn-primary" type="submit" >Find</button>
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