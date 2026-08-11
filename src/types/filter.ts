/**
 * フィルタ・並び替えボタンの選択肢。
 *
 * types/index.ts ではなく独立させているのは、config/primarySources.ts がこれを使う一方で
 * types/index.ts が config/primarySources.ts を参照しており、循環参照になるため
 */
export interface FilterOption {
  value: string;
  label: string;
  isDefault?: boolean;
}
