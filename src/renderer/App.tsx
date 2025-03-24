import React from 'react';
import { HashRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { IpcRender_InitLanguage } from './util';
import GuestRoutes from './routes/GuestRoutes';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
import { RootState } from './redux/store';
import "./App.scss";

interface AppProps {
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
}

class App extends React.Component<AppProps> {
  componentDidMount() {
    this.applyTheme(this.props.theme);

    // send to main process to change the language
    const savedLanguage = localStorage.getItem('language') as 'en' | 'zh' | null;
    const defaultLanguage = savedLanguage || 'en';
    IpcRender_InitLanguage(defaultLanguage);
  }

  componentDidUpdate(prevProps: AppProps) {
    if (prevProps.theme !== this.props.theme) {
      this.applyTheme(this.props.theme);
    }
  }

  applyTheme(theme: 'light' | 'dark') {
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--body-background', `linear-gradient(200.96deg,#fedc2a -29.09%,#dd5789 51.77%,#7a2c9e 129.35%)`);
      root.style.setProperty('--background-color', '#ffffff');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--button-text-color', '#000000');
      root.style.setProperty('--button-bg', '#f0f0f0');
      root.style.setProperty('--button-border', '#ccc');
    } else {  //dark theme
      root.style.setProperty('--body-background', `linear-gradient(200.96deg, #ab27a0 -29.09%, #190e6d 51.77%, #07010a 129.35%)`);
      root.style.setProperty('--background-color', '#333333');
      root.style.setProperty('--text-color', '#bdbdbd');
      root.style.setProperty('--button-text-color', '#ffffff');
      root.style.setProperty('--button-bg', '#555555');
      root.style.setProperty('--button-border', '#888888');
    }
  }

  render() {
    const { isAuthenticated } = this.props;

    return (
      <HashRouter>
        {isAuthenticated
          ? <AuthenticatedRoutes />
          : <GuestRoutes />}
      </HashRouter>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  theme: state.theme.theme
});

export default connect(mapStateToProps)(App);
