import {Answer} from "../../../../../models/answer";
import {Question} from "../../../../../models/question";
import {Filter} from "./filter";

export interface ReportData {
  readonly countries: Array<string>,
  readonly answers: Array<Answer>,
  readonly questions: Array<Question>,
  readonly filter: Filter,
  readonly lang: string,
  readonly marketReport: any
}