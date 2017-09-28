import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { EnvironmentService } from '../../../../services/common/environment.service';
import { MediaService } from '../../../../services/media/media.service';
import { langSelectOptions } from '../../../../data/innovation.data';
import { TranslateService, initTranslation } from './i18n/i18n';

@Component({
  selector: 'app-client-my-projects',
  templateUrl: './client-my-projects.component.html',
  styleUrls: ['./client-my-projects.component.scss']
})
export class ClientMyProjectsComponent implements OnInit {

  // private _selectedOrderBy: any; TODO
  // private _selectedFilterBy: any; TODO


  private _projects: [any];
  private _selectLangInput = '';
  private _wantToCreateNewProject = false;


  constructor(private _translateService: TranslateService,
              private _userService: UserService,
              private _innovationService: InnovationService,
              private _titleService: Title,
              private _mediaService: MediaService,
              private _environmentService: EnvironmentService,
              private _router: Router) { }


  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('My projects'); // TODO translate
    this._userService.getMyInnovations().subscribe(projects => {
      this._projects = projects.innovations;
    });

    this._selectLangInput = this._translateService.currentLang || this._translateService.getBrowserLang() || 'fr';
  }

  createProject() {
    const lang = this._selectLangInput;
    const domain = this._environmentService.getDomain();
    const newProject = {
      /* country: lang, le serveur
      name: ''
      lang: lang*/
      country: lang,
      domain: domain,
      title: lang === 'fr' ? 'Donnez un nom à votre project' : 'Give a name to your project',
      lang: lang
    };

    this._innovationService.create(newProject).subscribe(project =>  {
      this._router.navigate(['/projects/' + project._id])
    });
  }

  removeProject(projectId) {
    this._innovationService.remove(projectId).subscribe(
      projectRemoved => this._projects.splice(this.getProjectIndex(projectId), 1));
  }

  getProjectIndex(innovationId: string): number {
    for (const innovation of this._projects) {
      console.log(innovationId);
      if (innovationId === innovation._id) {
        return this._projects.indexOf(innovation);
      }
    }
  }

  getPrincipalMedia(innovation): string {
    if (innovation.media) {
      return this._mediaService.buildUrl(innovation.media.id);
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/v1506516385/Application/empty-project.png';
    }
  }


  get innovations () { // TODO     : Project[] { (using server)
    return this._projects;
  }

  get langOptions(): any {
    return langSelectOptions;
  }

  get selectLangInput(): string {
    return this._selectLangInput;
  }
  set selectLangInput(value: string) {
    this._selectLangInput = value;
  }

  get wantToCreateNewProject(): boolean {
    return this._wantToCreateNewProject;
  }
  set wantToCreateNewProject(value: boolean) {
    this._wantToCreateNewProject = value;
  }
}
