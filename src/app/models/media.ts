interface Cloudinary {
  readonly public_id: string;
  readonly height: Number;
  readonly width: Number;
}

enum TypeEnum {
  PHOTO = PHOTO,
  VIDEO = VIDEO,
  TEXT = TEXT
}

export interface Media {
  readonly id: string;
  readonly _id: string;
  readonly format: string;
  readonly type: TypeEnum;
  readonly name: string;
  readonly url: string;
  readonly cloudinary: Cloudinary;
}
