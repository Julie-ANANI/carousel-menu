export class JsonUtils {

  /**
   * Transform json to array of objects
   * From : {"key1": {data1: value1, data2: value2}, "key2": {data1: value1, data2: value2}}
   * To : [{id: key1, data1: value1, data2: value2}, {id: key2, data1: value1, data2: value2}]
   * @param json
   */
  static jsonToArray(json: Object): any[] {
    const array = [];
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        array.push({
          id: key,
          ...json[key]
        });
      }
    }
    return array;
  }

}
