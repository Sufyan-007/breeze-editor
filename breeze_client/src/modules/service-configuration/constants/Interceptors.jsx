export const RequestInterceptors = {
  name: 'sampleRequestInterceptor',
  type: 'REQUEST',
  interceptorCode: '(config) => { config.headers = {Authorization: "My Bearer Token"};};',
  errorCode: '(err) =>{ return Promise.reject(err);};',
};

export const ResponseInterceptors = {
  name: 'sampleResponseInterceptor',
  type: 'RESPONSE',
  interceptorCode: '(response) => { return response;};',
  errorCode: '(err) =>{ if(err.response.status === 401){console.log("unauthorized)};',
};
