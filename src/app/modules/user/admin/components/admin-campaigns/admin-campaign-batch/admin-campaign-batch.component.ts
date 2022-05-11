import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign, CampaignStats } from '../../../../../../models/campaign';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { Batch } from '../../../../../../models/batch';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';
import { isPlatformBrowser } from '@angular/common';
import { first, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { Subject } from 'rxjs';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { MissionService } from '../../../../../../services/mission/mission.service';
import { Mission } from '../../../../../../models/mission';
import { StatsInterface } from "../../../../../../models/stats";
import { Table, UmiusSidebarInterface } from '@umius/umi-common-component';
import { lang, Language } from "../../../../../../models/static-data/language";

@Component({
  templateUrl: './admin-campaign-batch.component.html',
  styleUrls: ['./admin-campaign-batch.component.scss'],
})
export class AdminCampaignBatchComponent implements OnInit, OnDestroy {
  private _campaign: Campaign = <Campaign>{};

  private _batches: any = {};

  private _batchesTable: Array<Table> = [];

  private _localConfig: any = {
    sort: {},
    search: {},
  };

  private _currentBatch: Batch = <Batch>{};

  private _content: any = {};

  private _currentRow = {};

  private _currentStep = 0;

  private _selectedBatchToBeDeleted: Batch = <Batch>{};

  private _modalDelete = false;

  private _sidebarValue: UmiusSidebarInterface = <UmiusSidebarInterface>{};

  private _campaignWorkflows: Array<string> = [];

  private _fetchingError = true;

  private _isDeletingBatch = false;

  private _isLoading = true;

  private _isEditable = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _innovation: Innovation = <Innovation>{};

  private _innovationCardLanguages: Array<Language> = [];

  private _statsConfig: Array<StatsInterface> = [];

  /***
   * Calcule d'une date d'envoi à partir des inputs de la date et heure
   * @param date
   * @param time
   */
  private static _computeDate(date: string, time: string) {
    const computedDate = new Date(date);
    const hours = parseInt(time.split(':')[0], 10);
    const minutes = parseInt(time.split(':')[1], 10);
    computedDate.setHours(hours);
    computedDate.setMinutes(minutes);
    return computedDate;
  }

  private static _getStatus(step: number, status: number): string {
    return status > step ? 'Sent' : 'Planned';
  }

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _campaignFrontService: CampaignFrontService,
              private _campaignService: CampaignService,
              private _missionService: MissionService,
              private _rolesFrontService: RolesFrontService,
              private _innovationFrontService: InnovationFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateService: TranslateService) {
  }

  // tslint:disable-next-line:max-line-length
  // TODO for testing only!// private testBatches = {'batches': [{'firstMail': '2020-12-16T07:50:00.000Z', 'secondMail': '2021-01-06T06:35:00.000Z', 'thirdMail': '2021-01-13T06:35:00.000Z', 'size': 300, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '5fd8fd361dfd73509e730ce1', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2020-12-15T18:15:18.454Z', 'stats': [{'delivered': 44, 'opened': 19, 'clicked': 0, 'bounced': 0, 'insights': 2, '_id': '602680e4c1469496021999c4'}, {'delivered': 31, 'opened': 12, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c1469428c81999c5'}, {'delivered': 40, 'opened': 14, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146949f481999c6'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469473bd1999c7'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf954ac5d5ad1a'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf95d1c3d5ad1b'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf9512b8d5ad1c'}], 'updated': '2021-02-12T13:21:40.961Z', 'workflow': 'GetInsights standard', 'id': '5fd8fd361dfd73509e730ce1'}, {'firstMail': '2020-12-17T05:05:19.134Z', 'secondMail': '2021-01-06T05:05:00.000Z', 'thirdMail': '2021-01-13T05:05:00.000Z', 'size': 3000, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '5fd8fd371dfd735b95730ce6', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2020-12-15T18:15:18.455Z', 'stats': [{'delivered': 308, 'opened': 106, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c14694b3741999c8'}, {'delivered': 390, 'opened': 117, 'clicked': 0, 'bounced': 0, 'insights': 2, '_id': '602680e4c1469466ef1999c9'}, {'delivered': 296, 'opened': 106, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146946d2a1999ca'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c14694835c1999cb'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf95e9a6d5ad1d'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf95ae9fd5ad1e'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf95ef7ed5ad1f'}], 'updated': '2021-02-12T13:21:40.961Z', 'workflow': 'GetInsights standard', 'id': '5fd8fd371dfd735b95730ce6'}, {'firstMail': '2020-12-17T05:05:19.134Z', 'secondMail': '2021-01-06T05:05:00.000Z', 'thirdMail': '2021-01-13T05:05:00.000Z', 'size': 3000, 'status': 3, 'active': true, 'nuggets': true, 'error': true, 'childBatch': [], '_id': '5fd8fd3a1dfd736885730cfb', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2020-12-15T18:15:18.456Z', 'stats': [{'delivered': 304, 'opened': 137, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c146940b0d1999cc'}, {'delivered': 383, 'opened': 134, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c14694992f1999cd'}, {'delivered': 271, 'opened': 124, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469460261999ce'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469415b81999cf'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf951e5cd5ad20'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf9571edd5ad21'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf954be3d5ad22'}], 'updated': '2021-02-12T13:21:40.961Z', 'workflow': 'GetInsights standard', 'id': '5fd8fd3a1dfd736885730cfb'}, {'firstMail': '2020-12-17T05:05:19.134Z', 'secondMail': '2021-01-06T05:05:00.000Z', 'thirdMail': '2021-01-13T05:05:00.000Z', 'size': 3000, 'status': 3, 'active': true, 'nuggets': true, 'error': true, 'childBatch': [], '_id': '5fd8fd3d1dfd73d0f0730d00', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2020-12-15T18:15:18.457Z', 'stats': [{'delivered': 355, 'opened': 158, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c14694c4251999d0'}, {'delivered': 424, 'opened': 149, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c1469412781999d1'}, {'delivered': 297, 'opened': 129, 'clicked': 0, 'bounced': 0, 'insights': 3, '_id': '602680e4c14694486e1999d2'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c14694f0ab1999d3'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf952114d5ad23'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf95cf6bd5ad24'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf9529ebd5ad25'}], 'updated': '2021-02-12T13:21:40.961Z', 'workflow': 'GetInsights standard', 'id': '5fd8fd3d1dfd73d0f0730d00'}, {'firstMail': '2020-12-17T05:05:19.134Z', 'secondMail': '2021-01-06T05:05:00.000Z', 'thirdMail': '2021-01-13T05:05:00.000Z', 'size': 2138, 'status': 3, 'active': true, 'nuggets': true, 'error': true, 'childBatch': [], '_id': '5fd8fd421dfd73581c730d05', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2020-12-15T18:15:18.458Z', 'stats': [{'delivered': 227, 'opened': 119, 'clicked': 0, 'bounced': 0, 'insights': 2, '_id': '602680e4c1469409931999d4'}, {'delivered': 323, 'opened': 133, 'clicked': 0, 'bounced': 0, 'insights': 3, '_id': '602680e4c146948e591999d5'}, {'delivered': 223, 'opened': 113, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469462431999d6'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146940dbb1999d7'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf956dded5ad26'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf953e5ad5ad27'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '5fd9b5e30ccf954a06d5ad28'}], 'updated': '2021-02-12T13:21:40.961Z', 'workflow': 'GetInsights standard', 'id': '5fd8fd421dfd73581c730d05'}, {'firstMail': '2021-01-06T05:47:00.000Z', 'secondMail': '2021-01-12T05:47:01.706Z', 'thirdMail': '2021-01-19T05:47:01.706Z', 'size': 3000, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '5ff2e3d934c0bf3d49157534', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-01-04T09:46:01.707Z', 'stats': [{'delivered': 292, 'opened': 109, 'clicked': 0, 'bounced': 0, 'insights': 3, '_id': '602680e4c14694c0a21999d8'}, {'delivered': 299, 'opened': 97, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c146944ea41999d9'}, {'delivered': 275, 'opened': 62, 'clicked': 0, 'bounced': 0, 'insights': 5, '_id': '602680e4c14694538a1999da'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469421831999db'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '0', '_id': '5ff44804cc2f14e62f02cf3c'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '5ff44804cc2f1459a902cf3d'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '5ff44804cc2f14596102cf3e'}], 'updated': '2021-02-12T13:21:40.961Z', 'workflow': 'GetInsights standard', 'id': '5ff2e3d934c0bf3d49157534'}, {'firstMail': '2021-01-06T05:47:00.000Z', 'secondMail': '2021-01-12T05:47:01.706Z', 'thirdMail': '2021-01-19T05:47:01.706Z', 'size': 1759, 'status': 3, 'active': true, 'nuggets': true, 'error': true, 'childBatch': [], '_id': '5ff2e3e034c0bf58f5157539', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-01-04T09:46:01.708Z', 'stats': [{'delivered': 223, 'opened': 109, 'clicked': 0, 'bounced': 0, 'insights': 2, '_id': '602680e4c1469446261999dc'}, {'delivered': 253, 'opened': 94, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469440871999dd'}, {'delivered': 185, 'opened': 42, 'clicked': 0, 'bounced': 0, 'insights': 2, '_id': '602680e4c146943f0c1999de'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146942e1e1999df'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '0', '_id': '5ff4480ccc2f14792102cf48'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '5ff4480ccc2f1420c902cf49'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '5ff4480ccc2f146d6d02cf4a'}], 'updated': '2021-02-12T13:21:40.961Z', 'workflow': 'GetInsights standard', 'id': '5ff2e3e034c0bf58f5157539'}, {'firstMail': '2021-01-07T05:09:19.175Z', 'secondMail': '2021-01-13T05:09:00.000Z', 'thirdMail': '2021-01-21T05:09:19.175Z', 'size': 1000, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '5ff5328b0f4d3566cfb4c89b', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-01-06T03:46:19.176Z', 'stats': [{'delivered': 123, 'opened': 54, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c14694daf21999e0'}, {'delivered': 151, 'opened': 35, 'clicked': 0, 'bounced': 0, 'insights': 4, '_id': '602680e4c146942aea1999e1'}, {'delivered': 91, 'opened': 5, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c14694096e1999e2'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c14694665a1999e3'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '0', '_id': '5ffd9b704f932c6bc5fc0b75'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '5ffd9b704f932c69cbfc0b76'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '5ffd9b704f932cdfc1fc0b77'}], 'updated': '2021-02-12T13:21:40.961Z', 'workflow': 'GetInsights standard', 'id': '5ff5328b0f4d3566cfb4c89b'}, {'firstMail': '2021-01-07T06:50:03.695Z', 'secondMail': '2021-01-13T06:50:00.000Z', 'thirdMail': '2021-01-21T06:50:03.695Z', 'size': 681, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '5ff55c6f0f4d351f7fb66cae', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-01-06T06:45:03.696Z', 'stats': [{'delivered': 85, 'opened': 29, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c146942be11999e4'}, {'delivered': 104, 'opened': 24, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146940f501999e5'}, {'delivered': 73, 'opened': 8, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146940fcb1999e6'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469402a61999e7'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '0', '_id': '5ffd9b784f932c283afc0b89'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '5ffd9b784f932c2e3ffc0b8a'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '5ffd9b784f932ca9a2fc0b8b'}], 'updated': '2021-02-12T13:21:40.961Z', 'workflow': 'GetInsights standard', 'id': '5ff55c6f0f4d351f7fb66cae'}, {'firstMail': '2021-01-14T05:04:44.814Z', 'secondMail': '2021-01-21T05:04:44.814Z', 'thirdMail': '2021-01-27T05:04:00.000Z', 'size': 1000, 'status': 3, 'active': true, 'nuggets': true, 'error': true, 'childBatch': [], '_id': '5ffed69c4f932c214801e338', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-01-13T11:16:44.815Z', 'stats': [{'delivered': 126, 'opened': 25, 'clicked': 0, 'bounced': 0, 'insights': 5, '_id': '602680e4c1469404af1999e8'}, {'delivered': 99, 'opened': 16, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c14694226b1999e9'}, {'delivered': 84, 'opened': 7, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146949dbe1999ea'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146949e661999eb'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601014f6b9676ae111dc3cf7'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601014f6b9676a3241dc3cf8'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601014f6b9676a807fdc3cf9'}], 'updated': '2021-02-12T13:21:40.961Z', 'workflow': 'GetInsights standard', 'id': '5ffed69c4f932c214801e338'}, {'firstMail': '2021-01-14T05:16:01.503Z', 'secondMail': '2021-01-21T05:16:01.503Z', 'thirdMail': '2021-01-27T05:16:00.000Z', 'size': 671, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '5ffef2554f932c1b3402158c', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-01-13T13:15:01.504Z', 'stats': [{'delivered': 118, 'opened': 29, 'clicked': 0, 'bounced': 0, 'insights': 2, '_id': '602680e4c1469465d41999ec'}, {'delivered': 107, 'opened': 20, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c14694a32f1999ed'}, {'delivered': 94, 'opened': 11, 'clicked': 0, 'bounced': 0, 'insights': 2, '_id': '602680e4c14694b0fe1999ee'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469443551999ef'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601014fcb9676ab8a0dc3d02'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601014fcb9676ac0fbdc3d03'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601014fcb9676a2a3ddc3d04'}], 'updated': '2021-02-12T13:21:40.961Z', 'workflow': 'GetInsights standard', 'id': '5ffef2554f932c1b3402158c'}, {'firstMail': '2021-01-18T06:44:04.484Z', 'secondMail': '2021-01-25T06:44:04.484Z', 'thirdMail': '2021-02-02T06:44:00.000Z', 'size': 1000, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '6000f7244f932caf2406c234', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-01-15T02:00:04.485Z', 'stats': [{'delivered': 89, 'opened': 26, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c1469477631999f0'}, {'delivered': 90, 'opened': 15, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c14694ae8f1999f1'}, {'delivered': 60, 'opened': 12, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c1469459351999f2'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146940b411999f3'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '6001a3b0ad7d2d0e5325a4c8'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '6001a3b0ad7d2d44fa25a4c9'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '6001a3b0ad7d2d0af325a4ca'}], 'updated': '2021-02-12T13:21:40.961Z', 'workflow': 'GetInsights standard', 'id': '6000f7244f932caf2406c234'}, {'firstMail': '2021-01-18T05:40:03.030Z', 'secondMail': '2021-01-25T05:40:03.030Z', 'thirdMail': '2021-02-02T05:40:00.000Z', 'size': 1000, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '6000faa74f932c478e06cd9c', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-01-15T02:15:03.031Z', 'stats': [{'delivered': 115, 'opened': 30, 'clicked': 0, 'bounced': 0, 'insights': 2, '_id': '602680e4c1469454c31999f4'}, {'delivered': 125, 'opened': 19, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c146942f7e1999f5'}, {'delivered': 128, 'opened': 15, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c146944ff01999f6'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469471b51999f7'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '6001a3b0ad7d2d92cf25a4cb'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '6001a3b0ad7d2d5df025a4cc'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '6001a3b0ad7d2d36b725a4cd'}], 'updated': '2021-02-12T13:21:40.964Z', 'workflow': 'GetInsights standard', 'id': '6000faa74f932c478e06cd9c'}, {'firstMail': '2021-01-18T05:24:02.579Z', 'secondMail': '2021-01-25T05:24:02.579Z', 'thirdMail': '2021-02-02T05:24:00.000Z', 'size': 1000, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '600113424f932ce90406ee7b', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-01-15T04:00:02.580Z', 'stats': [{'delivered': 74, 'opened': 22, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c1469477411999f8'}, {'delivered': 90, 'opened': 18, 'clicked': 0, 'bounced': 0, 'insights': 3, '_id': '602680e4c14694b68e1999f9'}, {'delivered': 67, 'opened': 11, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c14694ccee1999fa'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c14694a5701999fb'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '6001a3b0ad7d2d14bc25a4ce'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '6001a3b0ad7d2d677225a4cf'}, {'clicked': 0, 'opened': 0, 'insights': '[0,0]', '_id': '6001a3b0ad7d2de2e725a4d0'}], 'updated': '2021-02-12T13:21:40.964Z', 'workflow': 'GetInsights standard', 'id': '600113424f932ce90406ee7b'}, {'firstMail': '2021-01-18T05:06:03.570Z', 'secondMail': '2021-01-25T05:06:03.570Z', 'thirdMail': '2021-02-02T05:06:00.000Z', 'size': 1000, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '600256b3627dcca3625458db', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-01-16T03:00:03.571Z', 'stats': [{'delivered': 127, 'opened': 33, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469446201999fc'}, {'delivered': 132, 'opened': 16, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c1469460b21999fd'}, {'delivered': 109, 'opened': 12, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146946fe91999fe'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146948d3a1999ff'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601019c8b9676ad8f8dc4799'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601019c8b9676a6793dc479a'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601019c8b9676aeef5dc479b'}], 'updated': '2021-02-12T13:21:40.964Z', 'workflow': 'GetInsights standard', 'id': '600256b3627dcca3625458db'}, {'firstMail': '2021-01-18T05:11:01.874Z', 'secondMail': '2021-01-25T05:11:01.874Z', 'thirdMail': '2021-02-02T05:11:00.000Z', 'size': 1000, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '600264c1627dcc10fc547ed7', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-01-16T04:00:01.875Z', 'stats': [{'delivered': 100, 'opened': 29, 'clicked': 0, 'bounced': 0, 'insights': 2, '_id': '602680e4c14694cf59199a00'}, {'delivered': 113, 'opened': 21, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469472fb199a01'}, {'delivered': 85, 'opened': 11, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c14694d6b5199a02'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146942e2a199a03'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601019ceb9676a11a4dc47a5'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601019ceb9676a1dbbdc47a6'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601019ceb9676af5aadc47a7'}], 'updated': '2021-02-12T13:21:40.964Z', 'workflow': 'GetInsights standard', 'id': '600264c1627dcc10fc547ed7'}, {'firstMail': '2021-01-18T05:33:02.091Z', 'secondMail': '2021-01-25T05:33:02.091Z', 'thirdMail': '2021-02-02T05:33:00.000Z', 'size': 1000, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '60027656627dcc423b54b258', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-01-16T05:15:02.092Z', 'stats': [{'delivered': 83, 'opened': 19, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146942a87199a04'}, {'delivered': 102, 'opened': 11, 'clicked': 0, 'bounced': 0, 'insights': 2, '_id': '602680e4c146945670199a05'}, {'delivered': 92, 'opened': 8, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469412c8199a06'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c14694850b199a07'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601019d5b9676a4ac1dc47ac'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601019d5b9676a46a3dc47ad'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601019d5b9676a4cbcdc47ae'}], 'updated': '2021-02-12T13:21:40.964Z', 'workflow': 'GetInsights standard', 'id': '60027656627dcc423b54b258'}, {'firstMail': '2021-01-18T05:23:09.595Z', 'secondMail': '2021-01-25T05:23:09.595Z', 'thirdMail': '2021-02-02T05:23:00.000Z', 'size': 279, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '60047b2936478c1548238ddf', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-01-17T18:00:09.596Z', 'stats': [{'delivered': 22, 'opened': 2, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146949b24199a08'}, {'delivered': 35, 'opened': 2, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146943a40199a09'}, {'delivered': 26, 'opened': 2, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c14694504b199a0a'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469444da199a0b'}], 'predictions': [{'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601019dab9676a77dfdc47ba'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601019dab9676aa187dc47bb'}, {'clicked': 0, 'opened': 0, 'insights': '0', '_id': '601019dab9676af748dc47bc'}], 'updated': '2021-02-12T13:21:40.964Z', 'workflow': 'GetInsights standard', 'id': '60047b2936478c1548238ddf'}, {'firstMail': '2021-02-02T06:01:15.798Z', 'secondMail': '2021-02-09T06:01:15.798Z', 'thirdMail': '2021-02-16T06:01:15.798Z', 'size': 2412, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '601881334b393d6321d7f00b', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-02-01T22:31:15.799Z', 'stats': [{'delivered': 160, 'opened': 37, 'clicked': 0, 'bounced': 0, 'insights': 4, '_id': '602680e4c14694b28c199a0c'}, {'delivered': 207, 'opened': 39, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c14694c697199a0d'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146943092199a0e'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c14694568e199a0f'}], 'predictions': [], 'updated': '2021-02-16T06:02:49.946Z', 'id': '601881334b393d6321d7f00b'}, {'firstMail': '2021-02-02T06:03:12.742Z', 'secondMail': '2021-02-09T06:03:12.742Z', 'thirdMail': '2021-02-16T06:03:12.742Z', 'size': 1000, 'status': 3, 'active': true, 'nuggets': true, 'error': true, 'childBatch': [], '_id': '601884784b393d31ced7f696', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-02-01T22:45:12.743Z', 'stats': [{'delivered': 99, 'opened': 11, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146940b38199a10'}, {'delivered': 114, 'opened': 5, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c14694530a199a11'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c14694066e199a12'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469431d9199a13'}], 'predictions': [], 'updated': '2021-02-16T06:03:42.669Z', 'id': '601884784b393d31ced7f696'}, {'firstMail': '2021-02-03T05:32:03.232Z', 'secondMail': '2021-02-10T05:32:03.232Z', 'thirdMail': '2021-02-17T05:32:03.232Z', 'size': 1000, 'status': 3, 'active': true, 'nuggets': true, 'error': false, 'childBatch': [], '_id': '601899874b393d66c5d81817', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-02-02T00:15:03.233Z', 'stats': [{'delivered': 75, 'opened': 18, 'clicked': 0, 'bounced': 0, 'insights': 1, '_id': '602680e4c146946daa199a14'}, {'delivered': 100, 'opened': 9, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146942f07199a15'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469458a3199a16'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146944729199a17'}], 'predictions': [], 'updated': '2021-02-17T05:32:22.816Z', 'id': '601899874b393d66c5d81817'}, {'firstMail': '2021-02-03T06:03:03.578Z', 'secondMail': '2021-02-10T06:03:03.578Z', 'thirdMail': '2021-02-17T06:03:03.578Z', 'size': 793, 'status': 3, 'active': true, 'nuggets': true, 'error': true, 'childBatch': [], '_id': '6018ae9f4b393d5ab7d84673', 'innovation': '5fbbc6a540f044563f83ba3c', 'campaign': '5fbbc6a540f0446d5883ba3d', 'created': '2021-02-02T01:45:03.578Z', 'stats': [{'delivered': 77, 'opened': 14, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146943a15199a18'}, {'delivered': 73, 'opened': 12, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469477b1199a19'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c146941995199a1a'}, {'delivered': 0, 'opened': 0, 'clicked': 0, 'bounced': 0, 'insights': 0, '_id': '602680e4c1469446e8199a1b'}], 'predictions': [], 'updated': '2021-02-17T06:03:39.034Z', 'id': '6018ae9f4b393d5ab7d84673'}]};

  ngOnInit() {
    this._activatedRoute.data.subscribe((data) => {
      if (data['campaign']) {
        this._campaign = data['campaign'];
        this._campaignFrontService.setActiveCampaign(this._campaign);
        this._campaignFrontService.setActiveCampaignTab('batch');
        this._initCampaign();
        this._campaignFrontService.setLoadingCampaign(false);
        this._statsConfig = this.setBatchesStatsConfig(this._campaign.stats);
      }
    });

    this._innovationFrontService
      .innovation()
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((innovation) => {
        this._innovation = innovation || <Innovation>{};
      });
  }

  // DEBUG AUTOBATCH => Creation de pro a la volée
  /*createPro() {
    this._campaignService.creerpro(this._campaign._id).subscribe();
  }*/

  public toSend(): string {
    return CampaignFrontService.getCampaignStats(
      this._campaign,
      'good_emails'
    ).toString(10);
  }

  private _initCampaign() {
    this._getInnovationLanguages();
    this._getBatches();

    const _scenariosNames: Set<string> = new Set<string>();

    if (this._campaign.settings && this._campaign.settings.emails) {
      this._campaign.settings.emails.forEach((email) => {
        if (email.modified) {
          _scenariosNames.add(email.nameWorkflow);
        } else {
          _scenariosNames.delete(email.nameWorkflow);
        }
      });
    }

    _scenariosNames.forEach((name) => {
      this._campaignWorkflows.push(name);
    });
  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = [
      'projects',
      'project',
      'campaigns',
      'campaign',
      'batch',
    ];
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(_default);
    }
  }

  public loadStats() {
    this._campaignService.getBatchesStats(this._campaign._id).subscribe((result) => {
      this._campaign.stats = result
      this._statsConfig = this.setBatchesStatsConfig(result);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error))
    })
  }

  private _getInnovationLanguages() {
    this._innovationCardLanguages = [];
    this._innovationCardLanguages = lang;
    // TODO
    // if (this._campaign
    //   && this._campaign.innovation
    //   && this._campaign.innovation.innovationCards
    //   && this._campaign.innovation.innovationCards.length) {
    //   this._campaign.innovation.innovationCards.map(innovationCard => {
    //     this._innovationCardLanguages.push({
    //       type: innovationCard.lang,
    //       status: innovationCard['status']});
    //   });
    // }
  }

  private _reinitializeVariables() {
    this._batches = {};
    this._batchesTable = [];
  }

  private _getBatches() {
    if (isPlatformBrowser(this._platformId)) {
      this._campaignService
        .getBatches(this._campaign._id)
        .pipe(first())
        .subscribe(
          (stats) => {
            this._batches = stats;
            this._batchesTable = [];
            if (this._batches.batches) {
              this._getMissionToUpdate(this._batches.batches);
              this._batches.batches.forEach((batch: Batch) => {
                this._batchesTable.push(this._initBatchTable(batch));
              });
            }
            this._isLoading = false;
          },
          (err: HttpErrorResponse) => {
            this._translateNotificationsService.error(
              'Message Stats Error...',
              ErrorFrontService.getErrorKey(err.error)
            );
            this._isLoading = false;
            console.error(err);
          }
        );
    }
  }

  private _getMissionToUpdate(batches: any) {
    if (batches.length > 0 && this.innovation.mission) {
      const fcDate = new Date(batches[0].firstMail);
      let missionId;
      if (typeof this.innovation.mission === 'string') {
        missionId = this.innovation.mission;
      } else {
        missionId = this.innovation.mission._id;
      }
      this._missionService.get(missionId).subscribe(
        (m) => {
          this._updateFeedbackDate(m, fcDate);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  private _updateFeedbackDate(mission: Mission, fcDate: Date) {
    if (mission.milestoneDates.length > 0) {
      const fcdObject = mission.milestoneDates.find(
        (item) => item.code === 'FC0'
      );
      if (fcdObject) {
        fcdObject.dueDate = fcDate;
        const missionObject = {
          milestoneDates: mission.milestoneDates,
        };
        this._missionService.save(mission._id, missionObject).subscribe(
          (savedMission) => {
            this._translateNotificationsService.success(
              'ERROR.SUCCESS',
              'SUCCESS'
            );
          },
          (err) => {
            this._translateNotificationsService.error(
              'ERROR.SUCCESS',
              err.message
            );
          }
        );
      }
    }
  }

  private _initBatchTable(batch: Batch): Table {
    const firstJSdate = new Date(batch.firstMail);
    const firstTime =
      ('0' + firstJSdate.getHours()).slice(-2) +
      ':' +
      ('0' + firstJSdate.getMinutes()).slice(-2);

    const secondJSdate = new Date(batch.secondMail);
    const secondTime =
      ('0' + secondJSdate.getHours()).slice(-2) +
      ':' +
      ('0' + secondJSdate.getMinutes()).slice(-2);

    const thirdJSdate = new Date(batch.thirdMail);
    const thirdTime =
      ('0' + thirdJSdate.getHours()).slice(-2) +
      ':' +
      ('0' + thirdJSdate.getMinutes()).slice(-2);

    const workflowName = ('Workflow ' + this._workflowName(batch)).toString();

    // const digit = 1; // number of decimals stats/pred

    const generateBatchLine = (i: number) => {
      const data = [
        {
          title: '01 - Hello World',
          date: batch.firstMail,
          time: firstTime,
          status: AdminCampaignBatchComponent._getStatus(0, batch.status),
        },
        {
          title: '02 - 2nd try',
          date: batch.secondMail,
          time: secondTime,
          status: AdminCampaignBatchComponent._getStatus(1, batch.status),
        },
        {
          title: '03 - 3rd try',
          date: batch.thirdMail,
          time: thirdTime,
          status: AdminCampaignBatchComponent._getStatus(2, batch.status),
        },
        {title: '04 - Thanks', date: '', status: '', time: ''},
      ];
      return {
        Step: data[i].title,
        Date: data[i].date,
        Time: data[i].time,
        Status: data[i].status,
      };
    };

    let content: any[];
    if (this._campaign && this._campaign.type === 'COMMUNITY') {
      content = [generateBatchLine(0), generateBatchLine(3)];
    } else {
      content = [
        generateBatchLine(0),
        generateBatchLine(1),
        generateBatchLine(2),
        generateBatchLine(3),
      ];
    }

    return {
      _selector: batch._id,
      _clickIndex:
        this.canAccess(['view']) || this.canAccess(['edit']) ? 1 : null,
      _isNoMinHeight: true,
      _content: content,
      _total: 1,
      _columns: [
        {
          _attrs: ['Step'],
          _name: workflowName,
          _type: 'TEXT',
        },
        {
          _attrs: ['Date'],
          _name: 'Date',
          _type: 'DATE',
          _isEditable: this.canAccess(['canEdit', 'date']),
          _editType: 'DATE'
        },
        {
          _attrs: ['Time'],
          _name: 'Time',
          _type: 'TEXT',
          _isEditable: this.canAccess(['canEdit', 'time']),
          _editType: 'DATE_TIME'
        },
        {
          _attrs: ['Status'],
          _name: 'Status',
          _type: 'MULTI-CHOICES',
          _choices: [
            {_name: 'Sent', _alias: 'Sent', _class: 'label is-success'},
            {_name: 'Planned', _alias: 'Planned', _class: 'label is-progress'},
          ],
        },
      ],
    };
  }

  public activateSidebar(type: string) {
    switch (type) {
      case 'NEW_BATCH':
        this._isEditable = true;
        this._sidebarValue = {
          animate_state: 'active',
          type: 'NEW_BATCH',
          title: 'New Batch',
        };
        break;

      case 'EDIT_BATCH':
        this._isEditable = this.canAccess(['edit']);
        this._sidebarValue = {
          animate_state: 'active',
          type: 'EDIT_BATCH',
          title: this.canAccess(['edit']) ? 'Edit Batch' : 'Batch',
          size: '726px',
        };
        break;
    }
  }

  /***
   * result won't be typed as batch every-time
   * @param event
   */
  public onSwitchAutoBatch(event: Event) {
    this._campaignService
      .AutoBatch(this._campaign._id)
      .pipe()
      .subscribe(
        (campaign: Campaign) => {
          this._campaign.autoBatch = campaign.autoBatch;
          const message = campaign.autoBatch
            ? 'The autobatch is on for this campaign. Batches will be created soon.'
            : 'The autobatch is off for this campaign. No new batch will be created.';
          this._translateNotificationsService.success('Success', message);
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'Auto Batch Error...',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }

  public setNuggets() {
    this._campaignService
      .setNuggets(this._campaign._id)
      .pipe(first())
      .subscribe(
        (result: Campaign) => {
          this._campaign = result;
          if (this._campaign.nuggets) {
            this._translateNotificationsService.success(
              'Success',
              'The nuggets have been activated.'
            );
          } else {
            this._translateNotificationsService.success(
              'Success',
              'The nuggets have been deactivated.'
            );
          }
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'Nuggets Error...',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }

  public onSidebarOutput(form: FormGroup) {
    switch (this._sidebarValue.type) {
      case 'NEW_BATCH':
        this._createNewBatch(form);
        break;

      case 'EDIT_BATCH':
        this._formBatchToUpdate(form);
        break;
    }
  }

  private _createNewBatch(formValue: FormGroup) {
    const _newBatch: Batch = {
      size: formValue.value['pros'],
      firstMail:
        formValue.value['send'] === 'true'
          ? Date.now()
          : AdminCampaignBatchComponent._computeDate(
            formValue.value['date'],
            formValue.value['time'] || '00:00'
          ),
      sendNow: formValue.value['send'],
      campaign: this._campaign,
      active: true,
    };

    this._campaignService
      .createNewBatch(this._campaign._id, _newBatch)
      .pipe(first())
      .subscribe(
        () => {
          this._translateNotificationsService.success(
            'Success',
            'The batch is created.'
          );
          this._closeSidebar();
          this._reinitializeVariables();
          this._getBatches();
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'Create Error...',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }

  private _closeSidebar() {
    this._sidebarValue = {
      animate_state: 'inactive',
    };
  }

  private _getBatchIndex(batchId: string): number {
    for (const batch of this._batches.batches) {
      if (batchId === batch._id) {
        return this._batches.batches.indexOf(batch);
      }
    }
  }

  private _workflowName(batch: Batch) {
    return (
      batch.workflow ||
      (this._campaign.settings && this._campaign.settings.defaultWorkflow)
    );
  }

  public getDeleteStatus(batch: Batch) {
    if (
      this._campaign.settings &&
      this._campaign.settings.ABsettings &&
      this._campaign.settings.ABsettings.status &&
      this._campaign.settings.ABsettings.status === '0'
    ) {
      return batch.status === 0;
    } else {
      if (
        (this._campaign.settings &&
          this._campaign.settings.ABsettings &&
          this._campaign.settings.ABsettings.batchA &&
          this._campaign.settings.ABsettings.batchA === batch._id) ||
        (this._campaign.settings &&
          this._campaign.settings.ABsettings &&
          this._campaign.settings.ABsettings.batchB &&
          this._campaign.settings.ABsettings.batchB === batch._id)
      ) {
        return false;
      } else {
        return batch.status === 0;
      }
    }
  }

  /**
   * this language is ready
   * quiz ok, workflow ok, status ok
   * @param language
   */
  isReady(language: Language) {
    // TODO: should add condition to check workflow
    return this._innovation.quizId
      && language['status']==='DONE' && this.isWorkflowReady(language)
  }

  /**
   * the emails are ready?
   * for fr, all the emails in french should be prepared
   * @param language
   */
  isWorkflowReady(language: Language){
    return this._campaign && this._campaign.settings
      && this._campaign.settings.emails
      && this._campaign.settings.emails.length
      && this._campaign.settings.emails.filter(email => email.language === language.type).length === 0
  }

  getTooltipMessage(language: Language){

  }



  public onDeleteBatch(event: Event, batch: Batch) {
    event.preventDefault();
    this._selectedBatchToBeDeleted = <Batch>{};
    this._modalDelete = true;
    this._selectedBatchToBeDeleted = batch;
  }

  public onConfirmDelete(event: Event) {
    event.preventDefault();
    if (!this._isDeletingBatch) {
      this._isDeletingBatch = true;
      this._campaignService
        .deleteBatch(this._selectedBatchToBeDeleted._id)
        .pipe(first())
        .subscribe(
          () => {
            this._isDeletingBatch = false;
            this._reinitializeVariables();
            this._getBatches();
            this._modalDelete = false;
            this._translateNotificationsService.success(
              'Success',
              'The batch is deleted.'
            );
          },
          (err: HttpErrorResponse) => {
            this._isDeletingBatch = false;
            this._translateNotificationsService.error(
              'Delete Error...',
              ErrorFrontService.getErrorKey(err.error)
            );
            console.error(err);
          }
        );
    }
  }

  public OnSwitchFreeze(event: Event, batch: Batch) {
    event.preventDefault();
    this._campaignService
      .freezeStatus(batch)
      .pipe(first())
      .subscribe(
        (modifiedBatch: any) => {
          this._batches.batches[
            this._getBatchIndex(modifiedBatch._id)
            ] = modifiedBatch;
          this._translateNotificationsService.success(
            'Success',
            'The batch is frozen.'
          );
        },
        (err: HttpErrorResponse) => {
          (event.target as HTMLInputElement).checked = batch.active;
          this._translateNotificationsService.error(
            'Freeze Error...',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }

  public onClickEdit(row: any, batch: Batch) {
    const stepInfo = this._currentStepInfo(row.Step);
    const step = stepInfo.step || '';
    this._currentStep = stepInfo.nbStep;
    this._content = this._contentWorkflowStep(batch, step);
    this._currentRow = row;
    this._currentBatch = batch;
    this.activateSidebar('EDIT_BATCH');
  }

  private _currentStepInfo(mail: string) {
    let nbStep = 0;
    let step = '';
    switch (mail) {
      case '01 - Hello World':
        step = 'FIRST';
        nbStep = 0;
        break;

      case '02 - 2nd try':
        step = 'SECOND';
        nbStep = 1;
        break;

      case '03 - 3rd try':
        step = 'THIRD';
        nbStep = 2;
        break;

      case '04 - Thanks':
        step = 'THANKS';
        nbStep = 3;
        break;
    }
    return {step: step, nbStep: nbStep};
  }

  private _contentWorkflowStep(batch: Batch, step: any): any {
    const workflowName = this._workflowName(batch);
    const content = {en: '', fr: '', _id: batch._id};

    if (this._campaign.settings && this._campaign.settings.emails) {
      this._campaign.settings.emails.forEach((mail) => {
        if (mail.step === step && workflowName === mail.nameWorkflow) {
          if (mail.language === 'en') {
            content.en = mail.content;
          } else {
            content.fr = mail.content;
          }
        }
      });
    }

    return content;
  }

  private _batchToUpdate(batch: Batch, step: any, date: any, time: any, workflow: any): Batch {
    switch (step) {
      case 0:
        batch.firstMail = AdminCampaignBatchComponent._computeDate(
          date,
          time
        );
        break;

      case 1:
        batch.secondMail = AdminCampaignBatchComponent._computeDate(
          date,
          time
        );
        break;

      case 2:
        batch.thirdMail = AdminCampaignBatchComponent._computeDate(
          date,
          time
        );
        break;
    }
    batch.workflow = workflow;
    return batch;
  }

  private _formBatchToUpdate(formValue: FormGroup) {
    this._currentBatch = this._batchToUpdate(this._currentBatch, this._currentStep,
      formValue.value['date'], formValue.value['time'], formValue.value['workflow']);
    this.updateBatch(this._currentBatch);
  }


  private updateBatch(batchToUpdate: Batch, needToUpdateTable = true) {
    this._campaignService
      .updateBatch(batchToUpdate)
      .pipe(first())
      .subscribe(
        (batch) => {
          if (needToUpdateTable) {
            this._batches.batches[this._getBatchIndex(batch._id)] = batch;
            this._batchesTable.every((table, index) => {
              if (table._selector === batch._id) {
                this._batchesTable[index] = this._initBatchTable(batch);
                return false;
              }
              return true;
            });
          }
          this._translateNotificationsService.success(
            'Success',
            'The batch is updated.'
          );
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'Update Error...',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }


  _updateBatch($event: any, batch: Batch) {
    if ($event) {
      switch ($event._action) {
        case 'Update grid':
          const stepInfo = this._currentStepInfo($event._context.Step);
          const _batchToUpdate = this._batchToUpdate(batch, stepInfo.nbStep, $event._context.Date,
            $event._context.Time, batch.workflow);
          this.updateBatch(_batchToUpdate, false);
          break;
      }
    }
  }

  private static _campaignBatchesStats(stats: CampaignStats, statKey: string, searchKey: string): string {
    return ((stats[statKey] && stats[statKey][searchKey]) || 0).toString();
  }

  public setBatchesStatsConfig(stats: CampaignStats): Array<StatsInterface> {
    return [
      {
        heading: 'Scheduled',
        content: [
          {
            subHeading: 'Pros scheduled',
            value: AdminCampaignBatchComponent._campaignBatchesStats(stats, 'pros', 'batched')
          },
          {
            subHeading: 'Good emails scheduled',
            value: AdminCampaignBatchComponent._campaignBatchesStats(stats, 'batches', 'goodEmails')
          },
          {
            subHeading: 'Risky emails scheduled',
            value: AdminCampaignBatchComponent._campaignBatchesStats(stats, 'batches', 'riskyEmails')
          }
        ]
      },
      {
        heading: 'Shots',
        content: [
          {
            subHeading: 'Shot 1 expected',
            value: AdminCampaignBatchComponent._campaignBatchesStats(stats, 'batches', 'shot1Expected')
          },
          {
            subHeading: 'Shot 2 expected',
            value: AdminCampaignBatchComponent._campaignBatchesStats(stats, 'batches', 'shot2Expected')
          },
          {
            subHeading: 'Shot 3 expected',
            value: AdminCampaignBatchComponent._campaignBatchesStats(stats, 'batches', 'shot3Expected')
          }
        ]
      }
    ];
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get autoBatchStatus() {
    return (
      this.quiz &&
      this.innovationStatus &&
      this.templatesStatus &&
      this.statusAB !== '1'
    );
  }

  get templatesStatus(): boolean {
    // TODO check Workflow
    const emailsImported = this._campaign.settings.emails.filter(e => ['en', 'fr'].indexOf(e.language) !== -1);
    return (
      this._campaign.settings &&
      this._campaign.settings.emails &&
      this._campaign.settings.emails.length !== 0 &&
      emailsImported.filter(e => e.modified === false).length === 0
    );
  }

  get innovationStatus(): boolean {
    return (
      this._campaign.innovation &&
      this._campaign.innovation.status &&
      (this._campaign.innovation.status === 'EVALUATING' ||
        this._campaign.innovation.status === 'DONE')
    );
  }

  get statusAB() {
    return this._campaign.settings && this._campaign.settings.ABsettings
      ? this._campaign.settings.ABsettings.status
      : null;
  }

  get defaultWorkflow() {
    return this._campaign.settings && this._campaign.settings.defaultWorkflow;
  }

  get quiz(): boolean {
    return (
      this._campaign &&
      this._campaign.innovation &&
      this._campaign.innovation.quizId !== ''
    );
  }

  get campaign() {
    return this._campaign;
  }

  get batches() {
    return this._batches;
  }

  get batchesTable() {
    return this._batchesTable;
  }

  get innovationCardLanguages(): Array<Language> {
    return this._innovationCardLanguages;
  }

  get currentBatch(): Batch {
    return this._currentBatch;
  }

  get content(): {} {
    return this._content;
  }

  get currentRow(): {} {
    return this._currentRow;
  }

  get localConfig(): any {
    return this._localConfig;
  }

  get selectedBatchToBeDeleted(): Batch {
    return this._selectedBatchToBeDeleted;
  }

  get modalDelete(): boolean {
    return this._modalDelete;
  }

  set modalDelete(value: boolean) {
    this._modalDelete = value;
  }

  get sidebarValue(): UmiusSidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: UmiusSidebarInterface) {
    this._sidebarValue = value;
  }

  get campaignWorkflows(): Array<string> {
    return this._campaignWorkflows;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get isDeletingBatch(): boolean {
    return this._isDeletingBatch;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get isEditable(): boolean {
    return this._isEditable;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get statsConfig(): Array<StatsInterface> {
    return this._statsConfig;
  }

  getBatch(index: number) {
    return this._batchesTable[index];
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
