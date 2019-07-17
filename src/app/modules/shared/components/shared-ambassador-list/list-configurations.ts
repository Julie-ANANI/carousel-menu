export class ListConfigurations {
  static getByDefaultConfig() {
    const _tableInfos = {
      _selector: 'admin-ambassador',
      _title: 'TABLE.TITLE.AMBASSADORS',
      _content: [''],
      _isTitle: true,
      _total: -1,
      _isDeletable: true,
      _isSelectable: true,
      _editIndex: 1,
      _isLocal: true,
      _isPaginable: true,
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
      _content: [''],
      _total: -1,
      _isTitle: true,
      _isSelectable: true,
      _editIndex: 1,
      _activeMinHeight: true,
      _isLocal: true,
      _isPaginable: true,
      _buttons: [{_label: 'Add', _icon: 'fas fa-plus'}],
      _columns: [
        {_attrs: ['firstName', 'lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT'},
        {_attrs: ['tags'], _name: 'TABLE.HEADING.SECTORS', _type: 'TAG-LIST'},
        {_attrs: ['ambassador.industry'], _name: 'TABLE.HEADING.INDUSTRY', _type: 'TEXT'},
        {_attrs: ['self'], _name: 'To project', _type: 'MULTI-CHOICES',
          _choices: [
            {_name: 'true', _alias: 'Added', _class: 'label is-success'},
            {_name: 'false', _alias: '--'}]
        }]
    };
    return _tableInfos;
  }

}
