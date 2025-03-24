import React from 'react';
import { connect } from 'react-redux';
import { login } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { RootState } from '../redux/store';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeSwitcher from '../components/ThemeSwitcher';
import icon from '../../../assets/icon.svg';
import icon_dark from '../../../assets/icon-dark.svg';

// Define the translation function type
type TranslationFunction = ReturnType<typeof useTranslation>['t'];

interface LoginProps {
  login: (user: { username: string }) => void;
  navigate: (path: string) => void;
  t: TranslationFunction;
  i18n: ReturnType<typeof useTranslation>['i18n'];
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
}

interface LoginState {
  username: string;
  password: string;
}

class LoginBase extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.navigate('/dashboard');
    }
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ [e.target.name]: e.target.value } as Pick<LoginState, keyof LoginState>);
  }

  handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const { username, password } = this.state;
    const { login, navigate } = this.props;
    if (username && password) {
      login({ username });
      navigate('/dashboard');
    }
  }

  render() {
    const { t, theme, isAuthenticated } = this.props;
    return (
      <div>
        <div className="Hello">
          {theme=='light'
            ?<img width="200" alt="icon" src={icon} />
            :<img width="200" alt="icon" src={icon_dark} />}
        </div>
        <h1>electron-react-boilerplate</h1>
        <div>
          <form onSubmit={(e)=>this.handleSubmit(e)}>
            <div>
              <input
                type="text"
                name="username"
                placeholder={t('login.username')}
                value={this.state.username}
                onChange={(e)=>this.handleInputChange(e)}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder={t('login.password')}
                value={this.state.password}
                onChange={(e)=>this.handleInputChange(e)}
              />
            </div>
            <button type="submit">{t('login.submit')}</button>
          </form>
        </div>
        <div className="Hello">
          <a
            href="https://electron-react-boilerplate.js.org/"
            target="_blank"
            rel="noreferrer"
          >
              <span role="img" aria-label="books">
                📚
              </span>
              {t('footer.readDoc')}
          </a>
          <a
            href="https://github.com/sponsors/electron-react-boilerplate"
            target="_blank"
            rel="noreferrer"
          >
              <span role="img" aria-label="folded hands">
                🙏
              </span>
              {t('footer.donate')}
          </a>
        </div>
        <LanguageSwitcher className="lang" />
        <ThemeSwitcher className="btn-theme" />
      </div>
    );
  }
}

const LoginWithNavigate = (props: Omit<LoginProps, 'navigate' | 't' | 'i18n'>) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  return <LoginBase {...props} navigate={navigate} t={t} i18n={i18n} />;
};

const mapStateToProps = (state: RootState) => ({
  theme: state.theme.theme,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(LoginWithNavigate);
