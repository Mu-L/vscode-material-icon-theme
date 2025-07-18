import { window as codeWindow, type QuickPickItem } from 'vscode';
import {
  capitalizeFirstLetter,
  type FolderThemeName,
  folderIcons,
  logger,
  translate,
} from '../../core';
import { getThemeConfig, setThemeConfig } from '../shared/config';

/** Command to toggle the folder icons. */
export const changeFolderTheme = async () => {
  try {
    const status = getFolderIconTheme();
    const response = await showQuickPickItems(status);
    if (response) {
      handleQuickPickActions(response);
    }
  } catch (error) {
    logger.error(error);
  }
};

/** Show QuickPick items to select preferred configuration for the folder icons. */
const showQuickPickItems = (activeTheme: FolderThemeName) => {
  const options = folderIcons.map(
    (theme): QuickPickItem => ({
      description: capitalizeFirstLetter(theme.name),
      detail:
        theme.name === 'none'
          ? translate('folders.disabled')
          : translate(
              'folders.theme.description',
              capitalizeFirstLetter(theme.name)
            ),
      label: theme.name === activeTheme ? '\u2714' : '\u25FB',
    })
  );

  return codeWindow.showQuickPick(options, {
    placeHolder: translate('folders.toggleIcons'),
    ignoreFocusOut: false,
    matchOnDescription: true,
  });
};

/** Handle the actions from the QuickPick. */
const handleQuickPickActions = (value: QuickPickItem) => {
  if (!value || !value.description) return;
  return setThemeConfig('folders.theme', value.description.toLowerCase(), true);
};

/** Get the current folder theme. */
export const getFolderIconTheme = () => {
  return getThemeConfig<FolderThemeName>('folders.theme') ?? 'none';
};
