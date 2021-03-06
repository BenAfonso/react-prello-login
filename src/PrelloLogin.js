import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PopupWindow from './PopupWindow'
import { toQuery } from './utils'

class PrelloLogin extends Component {
  static propTypes = {
    buttonText: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    clientId: PropTypes.string.isRequired,
    onRequest: PropTypes.func,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    redirectUri: PropTypes.string.isRequired,
    scope: PropTypes.string
  }

  static defaultProps = {
    buttonText: 'Sign in with Prello',
    scope: '',
    onRequest: () => {},
    onSuccess: () => {},
    onFailure: () => {}
  }

  onBtnClick = () => {
    const { clientId, redirectUri, scope } = this.props
    const search = toQuery({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope
    })
    const popup = this.popup = PopupWindow.open(
      'prello-oauth-authorize',
      `https://themightyprello-server.igpolytech.fr/oauth/prello/login?${search}`,
      { height: 1000, width: 600 }
    )

    this.onRequest()
    popup.then(
      data => this.onSuccess(data),
      error => this.onFailure(error)
    )
  }

  onRequest = () => {
    this.props.onRequest()
  }

  onSuccess = (data) => {
    console.log(data)
    if (!data.code) {
      return this.onFailure(new Error('\'code\' not found'))
    }

    this.props.onSuccess(data)
  }

  onFailure = (error) => {
    this.props.onFailure(error)
  }

  render () {
    const { className, buttonText, children } = this.props
    const attrs = { onClick: this.onBtnClick }

    if (className) {
      attrs.className = className
    }

    return <button {...attrs}>{ children || buttonText }</button>
  }
}

export default PrelloLogin
