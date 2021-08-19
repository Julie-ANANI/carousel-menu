/**
 * Created by bastien on 19/12/2017.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professional } from '../../models/professional';

@Injectable({ providedIn: 'root' })
export class ProfessionalsService {
  constructor(private _http: HttpClient) {}

  public create(
    professionalArray: Array<Professional>,
    campaignId: string,
    innovationId: string
  ): Observable<any> {
    return this._http.post(
      `/professional/create/${campaignId}/${innovationId}`,
      { professionals: professionalArray }
    );
  }

  public get(id: string): Observable<any> {
    return this._http.get('/professional/' + id);
  }

  public getAll(config: {
    [header: string]: string | string[];
  }): Observable<any> {
    return this._http.get('/professional/', { params: config });
  }

  public remove(professionalId: string): Observable<any> {
    return this._http.delete('/professional/' + professionalId);
  }

  public removeFromCampaign(
    campaignId: string,
    innovationId: string,
    body: any,
  ): Observable<any> {
    return this._http.post(
      `/professional/removePros/${campaignId}/${innovationId}`, body
    );
  }

  public removeAllFromCampaign(
    oldCampaignId: string,
    oldInnovationId: string,
    data: any,
  ): Observable<any> {
    return this._http.post(`/professional/removeAll/${oldCampaignId}/${oldInnovationId}`, data);
  }

  public save(
    professionalId: string,
    professionalObj: Professional
  ): Observable<any> {
    return this._http.put('/professional/' + professionalId, professionalObj);
  }

  public addFromRequest(config: any): Observable<any> {
    return this._http.post(
      `/professional/addFromRequest/${config.newCampaignId}/${config.newInnovationId}`,
      config
    );
  }

  public addFromHistory(config: any): Observable<any> {
    return this._http.post(
      `/professional/addFromHistory/${config.newCampaignId}/${config.newInnovationId}`,
      config
    );
  }

  public export(config: any): Observable<any> {
    return this._http.post('/professional/exportCSV', config, {
      responseType: 'blob',
    });
  }

  public importProsFromCampaign(
    oldCampaignId: string,
    newCampaignId: string,
    oldInnovationId: string,
    newInnovationId: string
  ): Observable<any> {
    const config = {
      professionals: 'all',
      query: {},
    };
    return this._http.post(
      `/professional/clone/${oldCampaignId}/${newCampaignId}/${oldInnovationId}/${newInnovationId}`,
      config
    );
  }

  public importProsFromCsv(
    campaignId: string,
    innovationId: string,
    file: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this._http.post(
      '/professional/import/' + campaignId + '/' + innovationId,
      formData
    );
  }

  public updateEmailConfidence(
    file: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this._http.post(
      '/professional/updateConfidence',
      formData
    );
  }

  public updateEmailConfidenceConfirm(
    file: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this._http.post(
      '/professional/updateConfidenceConfirm',
      formData
    );
  }

  public createAmbassadors(
    professionalArray: Array<Professional>
  ): Observable<any> {
    return this._http.post(`/professional/ambassador/create`, {
      professionals: professionalArray,
    });
  }

  public importAmbassadorsFromCSV(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this._http.post('/professional/ambassador/upload', formData);
  }

  public cleanPros(): Observable<any> {
    return this._http.get(`/professional/update/database`);
  }

  public isShielded(id: string): Observable<any> {
    return this._http.get(`/shield/?professional=${id}&fields=email`);
  }

  public changeProLanguage(
    professionalId: string,
    language: string
  ): Observable<any> {
    return this._http.put(`/professional/${professionalId}`, {
      language: language,
    });
  }

  public addContactEmail(
    professionalId: string,
    email: string
  ): Observable<any> {
    return this._http.get(
      `/professional/${professionalId}/addContactEmail?email=${email}`
    );
  }
}
