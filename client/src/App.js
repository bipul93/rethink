import React, { Component } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
    state = {
        data: null,
        urlToShorten: null,
        shortendurl: null
    };

    componentDidMount() {
        this.callBackendAPI()
        .then(res => this.setState({ data: res.express }))
        .catch(err => console.log(err));
    }

    callBackendAPI = async () => {
        const response = await fetch('/express_backend');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };

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


    render() {
        return (
            <div className="container-fluid">
                <header className="row header">RETHINK</header>
                <div className="row content">
                    <div className="col">
                        <h6>Shorten your URL</h6>
                        <div className="form-group">
                            <input type="text" className="form-control" onChange={event => this.seturl(event.target.value)} placeholder="Enter your URL here"/>
                        </div>
                        <div>
                            <button className="btn btn-primary" onClick={event => this.shortenUrl()}>Generate</button>
                        </div>
                    </div>
                    {this.state.shortendUrl != null && (
                        <div className="m-4">
                            <p className="">your shortend url is: <a href={this.state.shortendUrl} target="_blank">{this.state.shortendUrl}</a></p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

}
export default App;
