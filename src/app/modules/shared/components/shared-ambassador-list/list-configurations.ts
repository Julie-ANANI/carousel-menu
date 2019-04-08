
export class ListConfigurations {
  static getByDefaultConfig() {
    const _tableInfos = {
      _selector: 'admin-ambassador',
      _title: 'TABLE.TITLE.AMBASSADORS',
      _content: [],
      _total: 0,
      _isFiltrable: false,
      _isLocal: true,
      _isHeadable: false,
      _isDeletable: true,
      _isSelectable: true,
      _actions: [],
      _columns: [
        {_attrs: ['firstName', 'lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT'},
        {_attrs: ['tags'], _name: 'TABLE.HEADING.SECTORS', _type: 'TAG-LIST'},
        {_attrs: ['ambassador.industry'], _name: 'TABLE.HEADING.INDUSTRY', _type: 'TEXT'},
        {_attrs: ['country'], _name: 'TABLE.HEADING.COUNTRY', _type: 'COUNTRY-NAME'},
        {_attrs: ['answers'], _name: 'TABLE.HEADING.FEEDBACK', _type: 'ARRAY'}]

    };
    return _tableInfos;
  }

  static getProfessionalSuggestionConfig() {
    const _tableInfos = {
      _selector: 'admin-ambassador',
      _title: 'TABLE.TITLE.AMBASSADORS',
      _content: [],
      _total: 0,
      _isFiltrable: false,
      _isLocal: true,
      _isHeadable: false,
      _isDeletable: true,
      _isSelectable: true,
      _actions: ['Add to the project'],
      _columns: [
        {_attrs: ['firstName', 'lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT'},
        {_attrs: ['tags'], _name: 'TABLE.HEADING.SECTORS', _type: 'TAG-LIST'},
        {_attrs: ['ambassador.industry'], _name: 'TABLE.HEADING.INDUSTRY', _type: 'TEXT'},
        {_attrs: ['status'], _name: 'Added to project', _type: 'TEXT'}]
    };
    return _tableInfos;
  }
}