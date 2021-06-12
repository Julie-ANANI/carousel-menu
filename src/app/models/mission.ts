import { Innovation } from './innovation';
import { User } from './user.model';
import { Multiling } from './multiling';


export type MissionType = 'USER' | 'CLIENT' | 'DEMO' | 'TEST';
export type MissionTemplateSectionType = 'NOTHING' | 'ISSUE' | 'SOLUTION' | 'OTHER' | 'CONTEXT';
export type MissionQuestionOptionType = 'checkbox' | 'radio' | 'stars' | 'textarea' | 'ranking' | 'scale';
export type MissionQuestionParameterType = 'color' | 'date' |'datetime-local' | 'email' | 'month' | 'number'
  | 'password' | 'tel' | 'text' | 'time' | 'url' | 'week' | '';


export interface MissionTemplateSectionEntry {
  name: string;
  lang: string;
}


export interface MissionTemplateSection {

  /**
   * based on ISSUE', 'SOLUTION', 'CONTEXT', 'OTHER' we create the sections in the
   * innovation card (back handles that).
   */
  type: MissionTemplateSectionType;

  /**
   * contains the list of the question for the template.
   * includes both the essential and complementary questions.
   */
  questions: Array<MissionQuestion>;

  /**
   * define the name of the section and the lang.
   * used for the questionnaire view
   */
  entry: Array<MissionTemplateSectionEntry>;

  /**
   * if we have more then one sections in the innovation card of same type in that case
   * we assign the section name as the identifier so that at the time of the quiz generation
   * we can identify which to take.
   * this value is assigned when the questionnaire is being created.
   * this value is not present all the time. It will come in play when we don't have the classic innovation.
   */
  identifier?: string;
}


export interface MissionQuestionEntry {
  lang: string;

  /**
   * Titre de la section dans l'infographie
   * Comes from the preset model.
   */
  title: string;

  /**
   * Sous-titre de la section dans le carré bleu de l'infographie
   * Comes from the preset model.
   */
  subtitle: string;

  /**
   * it's a text used in the quiz front for help or an instruction based on the questionType.
   * editable by the operator.
   * Comes from the preset model.
   */
  instruction: string;

  /**
   * Positive answers label
   * Comes from the preset model.
   */
  positivesAnswersLabel?: string;

  /**
   * Intitulé de la question (text used in the Quiz)
   */
  label: string;

  /**
   * text that we show to the client.
   */
  objective: string;
}


export interface MissionQuestionOption {

  /**
   * it's a text used in the quiz front for help or an instruction based on the questionType.
   * editable by the operator.
   * Comes from the preset model.
   */
  identifier?: string;

  /**
   * La couleur dans laquelle est représentée l'option dans les charts de l'infographie
   * Comes from the preset model.
   */
  color?: string;

  /**
   * (ie à prendre en compte dans l'infographie dans les x% de réponses positives à la question)
   * Comes from the preset model.
   */
  positive?: boolean;
  entry: Array<{
    label: string;
    lang: string;
  }>;
}


export interface MissionQuestion {
  readonly _id?: string;
  readonly created?: Date;

  /**
   * COMPLEMENTARY - each template has some additional questions that can be selected or not. client has right
   * to change these questions.
   * ESSENTIALS - these are questions defined by us for each template every template has fixed number of these
   * questions client dose not have right to change them.
   */
  type: 'COMPLEMENTARY' | 'ESSENTIAL';

  /**
   * stores the information.
   */
  entry: Array<MissionQuestionEntry>;

  /***
   * this is to, when the client and operator having
   * discussion to finalize the questionnaire template.
   * Comes from the preset model.
   */
  requirements?: [{
    lang: String,
    text: String
  }];

  /**
   * Comes from the preset model.
   */
  isTagged?: boolean;

  /**
   * maximum options he can select for controlType === 'checkbox'
   * Comes from the preset model.
   */
  maxOptionsSelect?: number;

  /**
   * Comes from the preset model.
   */
  controlType: MissionQuestionOptionType;

  /**
   * used this to activate/deactivate a field or legend or anything
   * For example: Activate/Deactivate "x% favourable responses" for type === 'radio'
   * Comes from the preset model.
   */
  visibility: boolean;

  /**
   * Possibilité d'ajouter un commentaire à sa réponse
   * Comes from the preset model.
   */
  canComment: boolean;

  /**
   * Answer contains sensitive private data as phone number or email
   * Comes from the preset model.
   */
  sensitiveAnswerData: boolean;

  /**
   * Generate a random id for custom questions
   * Comes from the preset model.
   */
  identifier: string;

  /**
   * Comes from the preset model.
   */
  parameters?: {
    type: {
      type: String,
      enum: MissionQuestionParameterType
      default: 'text'
    },
    addon: {
      type: String
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    step: {
      type: Number
    }
  };

  /**
   * Liste des réponses possibles à la question for the controlType = 'radio' | 'checkbox' | 'stars'
   * Comes from the preset model.
   */
  options?: Array<MissionQuestionOption>;
}


export interface MissionTemplate {
  readonly _id: string;

  /**
   * number of sections to have in the Innovation Card and of which type.
   * length of array represents the number of the section in innovation card.
   * And we also use the sections to show the sections of the questionnaire
   * Every section will have essentials and complementary questions in it.
   *
   * PLEASE NOTE: we don't use the 'NOTHING' section info to create the innovation card
   * we need it for the questionnaire because it is for general questions.
   */
  sections: Array<MissionTemplateSection>;

  entry: Array<{
    lang: string;
    /**
     * name of the template (show to the user)
     */
    objective: string;
  }>;
}


export interface  Milestone {
 name: string;
 code: string;
 dueDate: Date;
 comment?: string;
}


export interface MailConfiguration {
  domain: string;
  service: string;
  region: string;
}


export interface Mission {
  readonly _id?: string;
  readonly created?: Date;
  mailConf?: Array<MailConfiguration>;

  /**
   * if the client deleted the project we make the status of the mission Hidden
   * instead of deleting it. (back takes care of it.)
   */
  readonly status?: 'PUBLISHED' | 'HIDDEN';

  /**
   * name of the mission
   */
  name?: string;

  innovations?: Array<Innovation>;
  goal?: string;

  /**
   * same as owner of the innovation
   */
  client?: User | string;

  /**
   * number of operators working on the mission.
   */
  team?: Array<User>;

  /**
   * use name & code 'RDO', when save the restitution date by owner while creating new project.
   * for code use the 'Page name' like 'NEW_PROJECT' when save any dates
   */
  milestoneDates?: Array<Milestone>;

  /**
   * the use case selected by the user for the Market Test.
   */
  template?: MissionTemplate;

  /**
   * comment written for the template.
   */
  objectiveComment?: string;

  /**
   * not using anymore. It's there for the old projects.
   * on 1st June, 2021
   */
  objective?: {
    principal: Multiling;
    secondary: Array<Multiling>;
    comment: string
  };

  /**
   * store the selection of the client for the diffusion of the project
   * outside the application
   */
  externalDiffusion?: {
    umi: boolean; // website
    community: boolean;
    social: boolean;
  };

  /**
   * USER - means the project is in Editing mode
   * CLIENT - means the project is accepted and now it's market test.
   */
  type?: MissionType;

}
