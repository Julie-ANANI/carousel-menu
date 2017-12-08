import { XHRBackend } from '@angular/http';
import { RequestOptions } from '../services/requestOptions';
import { Http } from '../services/http';
import { LoaderService } from '../services/loader/loader.service';
import { TranslateNotificationsService } from '../services/notifications/notifications.service';

function httpFactory(backend: XHRBackend, options: RequestOptions, loaderService: LoaderService, notificationsService: TranslateNotificationsService) {
  return new Http(backend, options, loaderService, notificationsService);
}
export { httpFactory };
