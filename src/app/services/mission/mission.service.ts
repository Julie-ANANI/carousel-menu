import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Mission, MissionQuestion, MissionTemplate} from '../../models/mission';
import { Observable } from 'rxjs';
import { Innovation } from '../../models/innovation';
import { Multiling } from '../../models/multiling';
import {Response} from '../../models/response';
import {Config} from '../../models/config';

@Injectable({providedIn: 'root'})
export class MissionService {

  constructor(private _http: HttpClient) { }

  /**
   * will return the list of all the questions.
   * @param config
   */
  public getAllQuestions(config?: Config): Observable<Response> {
    return this._http.get<Response>('/mission/questions/all', {params: config});
  }

  /**
   * will create a new question of type MissionQuestion. It should be only used
   * for the Questions or Use cases under Library page because it will add the question
   * directly in the collection MissionQuestions
   *
   * @param questionObj
   */
  public createQuestion(questionObj: MissionQuestion): Observable<MissionQuestion> {
    return this._http.post<MissionQuestion>('/mission/questions/create', questionObj);
  }

  /**
   * will return the question based on the id. It will work with the new use case questions.
   *
   * @param questionId
   */
  public getQuestion(questionId: string): Observable<MissionQuestion> {
    return this._http.get<MissionQuestion>(`/mission/questions/${questionId}`);
  }

  /**
   * this function is to update the question in the back. It will work with the new use case questions.
   *
   * @param questionId
   * @param question
   */
  public updateQuestion(questionId: string, question: MissionQuestion): Observable<MissionQuestion> {
    return this._http.put<MissionQuestion>(`/mission/questions/${questionId}`, question);
  }

  /**
   * will return the template based on the id
   * @param templateId
   */
  public getTemplate(templateId: string): Observable<MissionTemplate> {
    return this._http.get<MissionTemplate>(`/mission/templates/${templateId}`);
  }

  /**
   * this function is to save the actual use case Mission Template i.e. global one.
   * @param templateId
   * @param template
   */
  public saveTemplate(templateId: string, template: MissionTemplate): Observable<MissionTemplate> {
    return this._http.put<MissionTemplate>(`/mission/templates/${templateId}`, template);
  }

  /**
   * this route is to save the changes in the questions and also template
   * under the Library page use case.
   * http://localhost:4200/user/admin/libraries/use-cases/60ae157190499526ef804c7d
   * @param templateId
   * @param data
   */
  public saveLibraryTemplate(templateId: string, data: {}): Observable<MissionTemplate> {
    return this._http.put<MissionTemplate>(`/mission/templates/${templateId}/library`, data);
  }

  /**
   * will return all the use cases templates we have defined for a mission.
   * @param config
   */
  public getAllTemplates(config?: Config): Observable<Response> {
    return this._http.get<Response>('/mission/templates/all', {params: config});
  }

  public create(missionObj: Mission): Observable<Mission> {
    return this._http.post<Mission>('/mission', missionObj);
  }

  public get(id: string): Observable<Mission> {
    return this._http.get<Mission>('/mission/' + id);
  }

  public getAll(config: {[header: string]: string | string[]}): Observable<{result: Array<Mission>, _metadata: any}> {
    return this._http.get<{result: Array<Mission>, _metadata: any}>('/mission/', {params: config});
  }

  public remove(missionId: string): Observable<Mission> {
    return this._http.delete<Mission>('/mission/' + missionId);
  }

  public save(missionId: string, missionObj: { [P in keyof Mission]?: Mission[P]; }): Observable<Mission> {
    return this._http.put<Mission>('/mission/' + missionId, missionObj);
  }

  public updateMainObjective(
    missionId: string,
    objective: { principal: Multiling; secondary: Array<Multiling>; comment: string }): Observable<Innovation> {
    return this._http.put<Innovation>(`/mission/${missionId}/updateMainObjective`, {objective: objective});
  }

  /**
   * this function is to update the template inside the mission.
   * @param missionId
   * @param data
   */
  public updateTemplate(missionId: string, data: {template: MissionTemplate, comment: string}): Observable<Innovation> {
    return this._http.put<Innovation>(`/mission/${missionId}/updateTemplate`, {data: data});
  }

}
