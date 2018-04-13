/**
 * Created by juandavidcruzgomez on 26/03/2018.
 */
export interface TagAttachment {
    readonly attachments: Array<{kind: string, uri: string, text: string, code:string}>;
}