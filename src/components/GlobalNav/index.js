/* global window */
import React, { PropTypes, Component } from 'react';
import * as customPropTypes from 'customPropTypes';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';

import LocaleSwitcher from 'components/LocaleSwitcher';

import debug from 'helpers/debug';

const styles = require('./style.scss');

class GlobalNav extends Component {
  state = {
    scrolled: false
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleNavbar, true);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleNavbar, true);
  }

  handleNavbar = () => {
    const { isStatic } = this.props;
    const { scrolled } = this.state;

    if (window.pageYOffset > 50) {
      if (!scrolled && !isStatic) {
        this.setState({ scrolled: true });
      }
    } else if (scrolled) {
      this.setState({ scrolled: false });
    }

    return false;
  };

  isHome() {
    return this.props.location.pathname === '/';
  }

  renderRightControls() {
    const { user, rightControls } = this.props;

    return (
      rightControls || [
        <li>
          <a
            href="https://quranicaudio.com/"
            target="_blank"
            rel="noopener noreferrer"
            data-metrics-event-name="Sites:Audio"
          >
            Audio
          </a>
        </li>,
        <li>
          <a
            href="http://salah.com/"
            target="_blank"
            rel="noopener noreferrer"
            data-metrics-event-name="Sites:Salah"
          >
            Salah
          </a>
        </li>,
        <li>
          <a
            href="http://sunnah.com/"
            target="_blank"
            rel="noopener noreferrer"
            data-metrics-event-name="Sites:Sunnah"
          >
            Sunnah
          </a>
        </li>,
        <LocaleSwitcher />,
        user
          ? <li>
            <Link
              to="/profile"
              data-metrics-event-name="IndexHeader:Link:Profile"
            >
              {user.firstName || user.name}
            </Link>
          </li>
          : <noscript />
      ]
    );
  }

  render() {
    const { leftControls, handleSidebarToggle, isStatic } = this.props;
    debug('component:GlobalNav', 'Render');

    return (
      <Navbar
        className={`montserrat ${this.state.scrolled && styles.scrolled}`}
        fixedTop={!isStatic}
        fluid
        static={isStatic}
      >
        <button
          type="button"
          className="navbar-toggle collapsed"
          onClick={handleSidebarToggle}
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
        <Nav className={styles.nav}>
          {!this.isHome() &&
            <li>
              <Link to="/"><i className="ss-icon ss-home" /></Link>
            </li>}
          {this.isHome() &&
            <LocaleSwitcher className="visible-xs-inline-block" />}
          {leftControls &&
            leftControls.map((control, index) =>
              React.cloneElement(control, { key: index })
            )}
        </Nav>
        <Nav pullRight className="hidden-xs hidden-sm">
          {this.renderRightControls().map((control, index) =>
            React.cloneElement(control, { key: index })
          )}
        </Nav>
      </Navbar>
    );
  }
}

GlobalNav.propTypes = {
  // handleToggleSidebar: PropTypes.func.isRequired,
  leftControls: PropTypes.arrayOf(PropTypes.element),
  rightControls: PropTypes.arrayOf(PropTypes.element),
  handleSidebarToggle: PropTypes.func.isRequired,
  isStatic: PropTypes.bool.isRequired,
  user: customPropTypes.userType,
  location: customPropTypes.location
};

GlobalNav.defaultProps = {
  isStatic: false
};

export default connect(state => ({
  user: state.auth.user
}))(GlobalNav);
