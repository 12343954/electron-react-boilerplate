import React from 'react';
import { connect } from 'react-redux';
import { setTheme } from '../redux/themeSlice';
import { RootState } from '../redux/store';

interface ThemeSwitcherProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  className?: string;
}

class ThemeSwitcherBase extends React.Component<ThemeSwitcherProps> {
  handleThemeSwitch = (): void => {
    const { theme, setTheme } = this.props;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }

  render() {
    const { theme, className } = this.props;
    return (
      <button
        onClick={this.handleThemeSwitch}
        className={className}
      >
        {theme === 'light' ? '☀️' : '🌙'}
      </button>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  theme: state.theme.theme
});

export default connect(mapStateToProps, { setTheme })(ThemeSwitcherBase);
