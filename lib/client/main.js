import React from 'react'
import ReactDom from 'react-dom'

import t from 'tcomb-form'
import tFiles from "tcomb-files"
import {EventEmitter} from "events"
import $ from "jquery"
const ee = new EventEmitter();
import bootstrap from 'react-bootstrap'
import b from 'bootswatch/united/bootstrap.css'
import c from './styles.css'
var formSchema = t.struct({
  dockerFile: tFiles.dockerfile.schema,
  hosts: tFiles.hosts.schema,
  remoteSendConfig: tFiles.remoteSendConfig.schema
})
var dataStore = {};
ee.on("docker-file", (data) => {
  dataStore["dockerFile"] = data;
  console.log(dataStore)
});
ee.on("hosts", (data) => {
  dataStore["hosts"] = data;
  console.log(dataStore)
});
ee.on("remote-send-config", (data) => {
  dataStore["remoteSendConfig"] = data;
  console.log(dataStore)
});

const RemoteBuilder = React.createClass({

  getInitialState: function() {
    $.get("/docker-file").then((value) => {
      this.setState({dockerFile:value, remoteSendConfig:this.state.remoteSendConfig});
    }).catch(function(){

    });

    $.get("/remote-send-config").then((value) => {
      this.setState({dockerFile:this.state.dockerFile, remoteSendConfig:value});
    }).catch(function(){

    });
    return {};
  },

  onSubmit(evt) {
    evt.preventDefault();
    const value = this.refs.form.getValue();
    if(value){
      $.ajax({url:"/files",method:"POST", contentType:'application/json', data:JSON.stringify(value)})
    }
  },

  render() {

    return (
      <div>
      <form onSubmit={this.onSubmit}>
        <t.form.Form ref="form" value={this.state} type={formSchema} />
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
      </div>
    )
  }

})

const DockerFile = React.createClass({

  getInitialState: function() {
    return {};
  },

  onSubmit(evt) {
    evt.preventDefault();
    const value = this.refs.form.getValue();
    if(value){
      ee.emit("docker-file", value)
    }
  },

  render() {
    return (
      <div>
      <form onSubmit={this.onSubmit}>
        <t.form.Form ref="form" type={tFiles.dockerfile.schema} />
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
      </div>
    )
  }

})

const Hosts = React.createClass({

  getInitialState: function() {
    return {};
  },

  onSubmit(evt) {
    evt.preventDefault();
    const value = this.refs.form.getValue();
    if(value){
      ee.emit("hosts", value)
    }
  },

  render() {
    return (
      <div>
      <form onSubmit={this.onSubmit}>
        <t.form.Form ref="form" type={tFiles.hosts.schema} />
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
      </div>
    )
  }

})

const RemoteSendConfig = React.createClass({

  getInitialState: function() {
    return {};
  },

  onSubmit(evt) {
    evt.preventDefault();
    const value = this.refs.form.getValue();
    if(value){
      ee.emit("remote-send-config", value)
    }
  },

  render() {
    return (
      <div>
      <form onSubmit={this.onSubmit}>
        <t.form.Form ref="form" type={tFiles.remoteSendConfig.schema} />
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
      </div>
    )
  }

})


ReactDom.render(<div>
  <RemoteBuilder />
</div>, document.getElementById("app"));
