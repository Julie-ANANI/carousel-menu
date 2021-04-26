export interface AutoSuggestionConfig {
  minChars?: number;
  placeholder?: string;
  type?: string;
  identifier?: string;
  default?: string;
  suggestionList?: Array<any>;
  requestType?: string;
  isShowAddButton?: boolean;
  showSuggestionFirst?: boolean;
}
