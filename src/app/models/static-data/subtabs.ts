export const preparationSubTabs = [
  {name: 'Description', path: 'description', access: ['settings', 'view', 'description'], parent: 'preparation'},
  {name: 'Questionnaire', path: 'questionnaire', access: ['questionnaire'], parent: 'preparation'},
  {name: 'Targeting', path: 'targeting', access: ['settings', 'view', 'targeting'], parent: 'preparation'},
  {name: 'Campaigns', path: 'campaigns', access: ['campaigns'], parent: 'preparation'},
  {name: 'Statistics', path: 'statistics', access: ['statistics'], parent: 'preparation'},
  {name: 'Campaign/Search', path: 'campaigns/search', access: ['campaigns', 'campaign', 'search'], parent: 'preparation'},
  {name: 'Campaign/History', path: 'campaigns/history', access: ['campaigns', 'campaign', 'history'], parent: 'preparation'},
  {name: 'Campaign/Pros', path: 'campaigns/pros', access: ['campaigns', 'campaign', 'pros'], parent: 'preparation'},
  {name: 'Campaign/Workflows', path: 'campaigns/workflows', access: ['campaigns', 'campaign', 'workflows'], parent: 'preparation'},
  {name: 'Campaign/Batch', path: 'campaigns/batch', access: ['campaigns', 'campaign', 'batch'], parent: 'preparation'},
];

export const analysisSubTubs = [
  {name: 'Synthesis', path: 'synthesis', access: ['synthesis'], parent: 'analyse'},
  {name: 'Answer tags', path: 'answer-tags', access: ['answerTags'], parent: 'analyse'},
  {name: 'Storyboard', path: 'storyboard', access: ['storyboard'], parent: 'analyse'},
];
