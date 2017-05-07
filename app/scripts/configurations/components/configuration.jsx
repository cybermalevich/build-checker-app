'use babel';

import React, { Component } from 'react';

import { DBClient } from '../../libraries/db';
const DBRepositories = DBClient('repositories');

const FORM_STATES = {
  NOT_STARTED: 'NOT_STARTED',
  INVALID: 'INVALID',
  ADDED: 'ADDED'
};

let timeoutId = null;

class Configuration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cctrayTrackingURL: '',
      submitted: false,
      formState: FORM_STATES.NOT_STARTED
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCCTrayTrackingURLChange = this.handleCCTrayTrackingURLChange.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(timeoutId);
  }

  handleCCTrayTrackingURLChange(e) {
    if (e.target.value !== this.state.cctrayTrackingURL) {
      this.setState({cctrayTrackingURL: e.target.value});
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({submitted: true});
    const cctrayTrackingURL = this.state.cctrayTrackingURL.trim();
    if (!cctrayTrackingURL) {
      this.setState({formState: FORM_STATES.INVALID});
      return;
    }
    const inserted = DBRepositories.insert({cctrayTrackingURL: cctrayTrackingURL});
    timeoutId = setTimeout(() => {
      if (inserted) {
        this.setState({cctrayTrackingURL: '', formState: FORM_STATES.ADDED, submitted: false});
      } else {
        this.setState({formState: FORM_STATES.INVALID, submitted: false});
      }
      timeoutId = setTimeout(() => {
        this.setState({formState: FORM_STATES.NOT_STARTED});
      }, 3000);
    }, 1000);
  }

  render() {

    var message  = '';
    if (this.state.formState === FORM_STATES.ADDED) {
      message = <div className="notify-success"> ✔ Repository information added</div>;
    } else if (this.state.formState === FORM_STATES.INVALID) {
      message = <div className="notify-error"> ✖ All the fields are required</div>;
    }

    let className = 'button-xlarge pure-button pure-button-primary';
    if (!!this.state.submitted) {
      className += ' m-progress';
    }

    return (
      <div>
        <h1>Build Checker App</h1>
        { message }
        <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
          <fieldset>
            <legend className="title">Configurations</legend>

            <label htmlFor="cctrayTrackingURL">CCTray Repo URL</label>
            <input id="cctrayTrackingURL" type="text"
            className="pure-input-1"
            placeholder="Repository name"
            value={this.state.cctrayTrackingURL}
            onChange={this.handleCCTrayTrackingURLChange} />
            <br/><br/><br/>

            <button type="submit" className={className} disabled={this.state.submitted}>ADD</button>
          </fieldset>
        </form>
      </div>
    );
  }
};


export default Configuration;
