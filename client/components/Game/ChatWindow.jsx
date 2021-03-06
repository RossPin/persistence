import React from 'react'
import { connect } from 'react-redux'

import ReactDOM from 'react-dom'

import moment from 'moment'

class ChatWindow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            msgs: [],
            chatMessage:"",
            localSocket: this.props.socket
        }
        this.addMsgToChat = this.addMsgToChat.bind(this);
    }

    componentDidMount() {
      this.mounted = true
      this.state.localSocket.on('chat-up', (msg) => {
          if(this.mounted) this.addMsgToChat(msg);
      })
      this.state.localSocket.on('joinedGame', (id, user_name) => {
          const msg = {
              userName: user_name,
              date: new Date(),
              chatMessage: `${user_name} has joined the game!`
          }
          if(this.mounted) this.addMsgToChat(msg)
      })
    }

    componentWillUnmount(){
      this.mounted = false
    }

    addMsgToChat(msg) {
        let prevMsgs = this.state.msgs
        prevMsgs.push(msg)
        this.setState({
            msgs:prevMsgs.map(msg => ({...msg})),
        }, () => this.scrollToBot())
    }

    scrollToBot() {
        ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
    }

    submit(e){
        e.preventDefault();
        if (this.state.chatMessage) {
        const userName = this.props.auth.user.display_name
        const newMsg = {
            userName,
            chatMessage: this.state.chatMessage,
            date: new Date
        }
        const roomID = this.props.id;
        this.state.localSocket.emit('chat-down', roomID, newMsg)
        }
        this.setState({chatMessage:""})
    }

    updateDetails(e){
        this.setState({
            [e.target.name]:e.target.value,
        })
    }

    render() {
        const styleObj = { overflow: 'auto', height: '150px'}
        return (
            <form className="chatWindow" onSubmit={this.submit.bind(this)}>
                <div className="column is-6 is-offset-3 innerShadow" ref="chats" style={styleObj} >
                    {this.state.msgs.map((msg, i) => <span key={i}>
                        <p className="level-item has-text-white level-left"><b>{msg.userName}</b> - {msg.chatMessage} - ({moment(msg.date).fromNow()})</p>
                    </span>)}
                </div>
                <div className="column is-6 is-offset-3">
                <input style={{width: "95%" }} className="input is-small has-text-white innerShadow chatInput" type="text" onChange={this.updateDetails.bind(this)} name="chatMessage" value={this.state.chatMessage}/>
                <input className="button is-dark is-small chatSubmit raise-black" type="submit" value="➤" />
                </div>
            </form>
        )
    }
}

const mapStateToProps = (state) => state

export default connect(mapStateToProps)(ChatWindow)
