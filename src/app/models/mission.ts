import { Innovation } from './innovation';
import { User } from './user.model';
import { InnovCardSection } from './innov-card';
import {MailConfiguration} from './mail-configuration';
import {UmiusMultilingInterface} from '@umius/umi-common-component';

export type MissionType = 'USER' | 'CLIENT' | 'DEMO' | 'TEST';
export type MissionTemplateSectionType = 'NOTHING' | 'ISSUE' | 'SOLUTION' | 'OTHER' | 'CONTEXT';
export type MissionQuestionType = 'checkbox' | 'radio' | 'stars' | 'textarea' | 'ranking' | 'scale' | 'likert-scale';
export type MissionQuestionParameterType = 'color' | 'date' |'datetime-local' | 'email' | 'month' | 'number'
  | 'password' | 'tel' | 'text' | 'time' | 'url' | 'week' | '';
export type AttitudeMeasureType = 'agreement' | 'frequency' | 'satisfaction' | 'use'| 'quality' | 'relevance' | 'importance'
  | 'interest' |'criticality' | 'adoptability' ;
export type MissionMethodologyType = 'DETECTING_MARKET' | 'VALIDATING_MARKET' | 'SOURCING_SOLUTIONS'
  | 'IDENTIFYING_RECEPTIVE' | 'VALIDATING_INTEREST' | 'OPTIMIZING_VALUE';


export interface MissionResult {
  abstract: string;
  items?: Array<MissionResultItem>;
}

export interface MissionResultItem {
  title: string;
  content: string;
}

export interface MissionCardTitle {
  en: Array<InnovCardSection>;
  fr: Array<InnovCardSection>;
}

export interface MissionTemplateSectionEntry {
  name: string;
  lang: string;
}

export interface OptionEntry {
  label: string;
  lang: string;
}

export interface MissionTemplateSection {
  readonly _id?: string;

  /**
   * based on ISSUE', 'SOLUTION', 'CONTEXT', 'OTHER' we create the sections in the
   * innovation card (back handles that).
   */
  type: MissionTemplateSectionType;

  /**
   * When we save the Template in the mission the type will be 'Mission Question'
   * otherwise it will be
   * {
   *   question: questionId,
   *   essential: boolean
   * }
   * contains the list of the question for the template.
   */
  questions: Array<any>;

  /**
   * define the name of the section and the lang.
   * used for the questionnaire view
   */
  entry: Array<MissionTemplateSectionEntry>;

  /**
   * if we have more than one sections in the innovation card of same type in that case
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
  readonly _id?: string;

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
   * (i.e à prendre en compte dans l'infographie dans les x% de réponses positives à la question)
   * Comes from the preset model.
   */
  positive?: boolean;

  entry: Array<OptionEntry>;
}


export interface MissionQuestion {
  readonly _id?: string;
  readonly created?: Date;
  readonly updated?: Date;

  /**
   * this value we use when we save the question in the innovation mission only so that in the settings
   * we can list the question.
   * COMPLEMENTARY - each template has some additional questions that can be selected or not. client has right
   * to change these questions.
   * ESSENTIALS - these are questions defined by us for each template every template has fixed number of these
   * questions' client does not have right to change them.
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
  controlType: MissionQuestionType;

  attitudeMeasure?: AttitudeMeasureType;

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
   * Les options de la question seront affichées aléatoirement côté quiz.
   * Comes from the preset model.
   */
  randomization: boolean;

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
    type: MissionQuestionParameterType;
    addon: string,
    min: number,
    max: number,
    step: number
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
   *
   * PLEASE NOTE: we don't use the 'NOTHING' section info to create the innovation card
   * we need it for the questionnaire because it is for general questions.
   */
  sections: Array<MissionTemplateSection>;

  /**
   * when adding the new project
   */
  category: 'INNOVATE' | 'INNOVATION';

  /**
   * defines the methodology (description to show)
   */
  methodology: MissionMethodologyType;

  entry: Array<{
    lang: string;

    /**
     * name of the template (show to the user)
     */
    objective: string;
  }>;
}


export interface  MissionMilestone {
 name: string;
 code: string;
 dueDate: Date;
 comment?: string;
 c
}


export interface Mission {
  readonly _id?: string;
  readonly created?: Date;

  /**
   * dynamic result specific to the use case.
   */
  result?: MissionResult;

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
  mailConf?: Array<MailConfiguration>;

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
  milestoneDates?: Array<MissionMilestone>;

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
   * on 1st June 2021
   */
  objective?: {
    principal: UmiusMultilingInterface;
    secondary: Array<UmiusMultilingInterface>;
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
   * CLIENT - means the project is accepted, and now it's market test.
   */
  type?: MissionType;

}
