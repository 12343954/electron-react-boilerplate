import React from 'react';
import { connect } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootState } from '../redux/store';

import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeSwitcher from '../components/ThemeSwitcher';
// import '../App.css';

interface DashboardProps {
  user: { username: string };
  logout: () => void;
  navigate: (path: string) => void;
  t: ReturnType<typeof useTranslation>['t']; // 使用类型别名
}

class DashboardBase extends React.Component<DashboardProps> {
  handleLogout = (): void => {
    const { logout, navigate } = this.props;
    logout();
    navigate('/login');
  }

  render() {
    const { user, t } = this.props;
    return (
      <div className="hello">
        <h2>{t('dashboard.welcome', { username: user.username })}!</h2>
        <button onClick={this.handleLogout}>{t('dashboard.logout')}</button>
        <LanguageSwitcher className="lang" />
        <ThemeSwitcher className="btn-theme" />
      </div>
    );
  }
}

const DashboardWithNavigate = (props: Omit<DashboardProps, 'navigate' | 't'>) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return <DashboardBase {...props} navigate={navigate} t={t} />;
};

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user as { username: string }
});

export default connect(mapStateToProps, { logout })(DashboardWithNavigate);
