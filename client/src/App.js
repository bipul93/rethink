import React, { Component } from 'react';
import { debounce } from 'lodash';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

let cancelled = true
class App extends Component {
    constructor(props){
        super(props)
        this.searchinput = React.createRef();
        this.state = {
            data: [],
            urlToShorten: null,
            shortendurl: null
        };
    }


    componentDidMount() {

    }

    seturl = (url) => {
        this.setState({urlToShorten: url})
    }

    shortenUrl = async () => {
        const response = await fetch('/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullUrl: this.state.urlToShorten
            })
        })
        .then(response => response.json())
        .then(data => {
            this.setState({shortendUrl: data.url})
        });
    }

    searchui = async (term) => {
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                term: term
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.result)
            this.setState({data: data.result})
        });
    }

    debouncedThing = debounce((term) => {
        console.log(term)
        this.searchui(term)
        this.debouncedThing.cancel()
        cancelled = true
    }, 500);

    onCharacterChange = (term) => {
        cancelled = false
        this.debouncedThing(term)
    }



    render() {
        let rows = this.state.data.map((data, index) => {
            data = data.fields
            return(
                <tr key={index}>
                  <td scope="row">{data.callsign}</td>
                  <td>{data.country}</td>
                  <td>{data.iata}</td>
                  <td>{data.icao}</td>
                  <td>{data.name}</td>
                  <td>{data.type}</td>
                </tr>
            )
        })
        return (
            <div className="container-fluid">
                <header className="row header">RETHINK</header>
                <div className="row content">
                    <div className="col shortner pt-5">
                        <h6>Shorten your URL</h6>
                        <div className="form-group">
                            <input type="text" className="form-control" onChange={event => this.seturl(event.target.value)} placeholder="Enter your URL here"/>
                        </div>
                        <div>
                            <button className="btn btn-primary" onClick={event => this.shortenUrl()}>Generate</button>
                        </div>
                        {this.state.shortendUrl != null && (
                            <div className="m-4">
                                <p className="">your shortend url is: <a href={this.state.shortendUrl} target="_blank">{this.state.shortendUrl}</a></p>
                            </div>
                        )}
                    </div>
                    <div className="col searchui pt-5">
                        <h6>Search UI</h6>
                        <div className="form-group">
                            <input type="text" className="form-control" ref={this.searchinput} onChange={event => this.onCharacterChange(event.target.value)} placeholder=""/>
                        </div>

                        {this.state.data.length != 0 && (
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th scope="col">callsign</th>
                                  <th scope="col">country</th>
                                  <th scope="col">iata</th>
                                  <th scope="col">icao</th>
                                  <th scope="col">name</th>
                                  <th scope="col">type</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rows}
                              </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        );
    }

}
export default App;
