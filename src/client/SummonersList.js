import React, { Component } from 'react';

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
                    <form onSubmit={this.handleFindStats}>
                        <textarea value={this.state.chatText} onChange={this.handleChatTextChange} rows="10" cols="50" placeholder="Insert yout chat text here"></textarea>
                        <input value={this.state.summonerName} onChange={this.handleSummonerNameChange} type="text" placeholder="Insert yout summoner name here"></input>
                        <input type="submit" value="Send"></input>
                    </form>
                </div>
                <div id="result">
                    <h1>Team</h1>
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
        </tr>
    );
}

function Summoner(props) {
    const champs = props.champs;
    const champsList = champs.map((champ) =>
        <Champ key={champ.name} name={champ.name} wins={champ.wins} losses={champ.losses} />
    );
    return (
        <div>
            <table>
                <tbody>
                    <tr><th id="summoner-name">{props.name}</th></tr>
                    <tr>
                        <th>Champ</th>
                        <th>Wins</th>
                        <th>Losses</th>
                    </tr>
                    {champsList}
                </tbody>
            </table>
        </div>
    );
}