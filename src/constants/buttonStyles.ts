/**
 * フィルタ・タブボタンの選択状態を表すクラス。
 *
 * 初期状態は.astroのフロントマターで描画し、クリック後の切り替えはクライアントスクリプトが行う。
 * 両者の文字列がずれるとボタンのスタイルが壊れるため、必ずここを参照すること。
 */
export const ACTIVE_BUTTON_CLASS = 'bg-gray-800 text-white dark:bg-white dark:text-gray-800';

export const INACTIVE_BUTTON_CLASS =
  'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
