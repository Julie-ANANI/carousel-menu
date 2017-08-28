import { XHRBackend } from '@angular/http';
import { RequestOptions } from '../services/requestOptions';
import { Http } from '../services/http';
import { LoaderService } from '../services/loader/loader.service';

function httpFactory(backend: XHRBackend, options: RequestOptions, loaderService: LoaderService ) {
  return new Http(backend, options, loaderService);
}
export { httpFactory };
