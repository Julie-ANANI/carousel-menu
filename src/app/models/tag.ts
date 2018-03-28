import {TagAttachment} from "./tag-attachment";
/**
 * Created by juandavidcruzgomez on 28/03/2018.
 */
export interface Tag {
    _id?: string;
    readonly label?: string;
    readonly attachments?: Array<TagAttachment>;
    readonly description?: string;
    readonly status?: string;
}