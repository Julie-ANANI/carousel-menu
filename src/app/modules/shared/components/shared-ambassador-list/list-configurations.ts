export class ListConfigurations {
  static getByDefaultConfig() {
    const _tableInfos = {
      _selector: 'admin-ambassador',
      _title: 'TABLE.TITLE.AMBASSADORS',
      _content: [],
      _total: -1,
      //_isLocal: true,
      _isDeletable: true,
      _isSelectable: true,
      _actions: [],
      _editIndex: 1,
      _columns: [
        {_attrs: ['firstName', 'lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT'},
        {_attrs: ['tags'], _name: 'TABLE.HEADING.SECTORS', _type: 'TAG-LIST'},
        {_attrs: ['ambassador.industry'], _name: 'TABLE.HEADING.INDUSTRY', _type: 'TEXT'},
        {_attrs: ['country'], _name: 'TABLE.HEADING.COUNTRY', _type: 'COUNTRY-NAME'},
        {_attrs: ['answers'], _name: 'TABLE.HEADING.FEEDBACK', _type: 'ARRAY', _isSortable: false}]

    };
    return _tableInfos;
  }

  static getProfessionalSuggestionConfig() {
    const _tableInfos = {
      _selector: 'admin-ambassador',
      _title: 'TABLE.TITLE.AMBASSADORS',
      _content: [],
      _total: -1,
      //_isLocal: true,
      _isSelectable: true,
      _editIndex: 1,
      _actions: ['Add'],
      _columns: [
        {_attrs: ['firstName', 'lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT'},
        {_attrs: ['tags'], _name: 'TABLE.HEADING.SECTORS', _type: 'TAG-LIST'},
        {_attrs: ['ambassador.industry'], _name: 'TABLE.HEADING.INDUSTRY', _type: 'TEXT'},
        {_attrs: ['self'], _name: 'To project',_isSortable: false, _type: 'MULTI-CHOICES',
          _choices: [
            {_name: 'true', _alias: 'Added', _class: 'label label-success'},
            {_name: 'false', _alias: '--'}]
        }]
    };
    return _tableInfos;
  }

}
