export interface IMetadata {
  name: string;
  description: string;
  background_color: string;
  image: string;
  animation_url: string;
  external_url: string;
  attributes: object[];
  properties: object[];
}
var _metadata: IMetadata = {
  name: '',
  description: '',
  background_color: '',
  image: '',
  animation_url: '',
  external_url: '',
  attributes: [],
  properties: [{files: []}],
};
var _metadataTypes = {
  owner: 'string',
  nameType: 'string',
  descriptionType: 'string',
  // background_colorType: 'color',
  imageType: 'file',
  animation_urlType: 'file',
  external_urlType: 'url',
  // youtube_urlType: 'url',
  attributesType: 'array',
  propertiesType: 'array',
};
export {_metadata, _metadataTypes};
