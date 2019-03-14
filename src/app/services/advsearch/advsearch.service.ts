/**
 * Created by juandavidcruz on 20/02/2019.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { Query } from "../../models/query";

@Injectable()
export class AdvSearchService {

  private _base: string = "/advsearch";

  constructor(private _http: HttpClient) { }

  /////////////// Advanced Search ///////////////
  // The idea of this piece is to use a new
  ///////////////////////////////////////////////

  /**
   * Configures a complex query to be passed to the advanced search module.
   * The idea is to aggregate several collections from the DB using a primary
   * key and some foreign keys.
   * Additionally we should be able to select different fields on those tables
   * but that should be left to the back end.
   * @param collections is an string array with the names of the collections to be
   * queried. The order is important because that will ne the order to do the
   * aggregation.
   * @param keys a list of keys to be used during the query. This is how we link
   * data primaryKey => foreignKey
   * @param searchOptions the query for each collection
   * @param config
   */
  /*public configureStarSearch(config: Array<Query>): any {
    if(config && config.length) {
      //Create stages
      const result = [];
      // Get the first entry as that's the main collection and will drive everything
      const baseQuery = config.shift();
      result.push({

      })

    } else {
      return {};
    }
  }*/

  public advsearch(config: {[header: string]: string | string[]}): Observable<any> {
    return this._http.get(`${this._base}/`, {params: config});
  }

  public getCommunityInnovations(config: {[header: string]: string | string[]}): Observable<any> {
    return this._http.get(`${this._base}/getCommunityInnovations`, {params: config});
  }

  public getCommunityMembers(config: {[header: string]: string | string[]}): Observable<any> {
    return this._http.get(`${this._base}/getCommunityMembers`, {params: config});
  }

}
