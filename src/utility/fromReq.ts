interface HeadersType {
  headers: object | any;
  'accept-language': string | any;
}

const getLangFromReq = (req: object | any = {}): string => {
  const headers: HeadersType = req.headers || {};
  const acceptLanguage: string = headers['accept-language'];
  return acceptLanguage && acceptLanguage.length > 0
    ? acceptLanguage.split(',')[0]
    : 'en';
};

export { getLangFromReq };
