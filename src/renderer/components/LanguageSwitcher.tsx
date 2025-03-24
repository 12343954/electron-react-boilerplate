import React from 'react';
import { useTranslation } from 'react-i18next';

import { IpcRender_ChangeLanguage } from '../util';

interface LanguageSwitcherProps {
  t: ReturnType<typeof useTranslation>['t'];
  i18n: ReturnType<typeof useTranslation>['i18n'];
  className?: string;
}

class LanguageSwitcherBase extends React.Component<LanguageSwitcherProps> {
  handleLanguageSwitch = (): void => {
    const { i18n } = this.props;
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);

    // window.electron.ipcRenderer.sendMessage('ipc-example',
    //                                     {
    //                                       action: IPC.Action.language.change,
    //                                       value: newLang
    //                                     });
    IpcRender_ChangeLanguage(newLang);
  }

  render() {
    const { t, className } = this.props;
    return (
      <button
        onClick={this.handleLanguageSwitch}
        className={className}>
        {t('dashboard.language')}
      </button>
    );
  }
}

const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation();
  return <LanguageSwitcherBase t={t} i18n={i18n} className={className} />;
};

export default LanguageSwitcher;
