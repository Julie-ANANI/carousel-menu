import { XHRBackend } from '@angular/http';
import { RequestOptions } from '../services/requestOptions';
import { Http } from '../services/http';
import { LoaderService } from '../services/loader/loader.service';
import { NotificationsService} from 'angular2-notifications';

function httpFactory(backend: XHRBackend, options: RequestOptions, loaderService: LoaderService, notificationsService: NotificationsService ) {
  return new Http(backend, options, loaderService, notificationsService);
}
export { httpFactory };
