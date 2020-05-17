import request from '@/utils/request';

export async function getDataAnalysisCount(params) {
  return request('/api/v1/dataAnalysis/operates/count', {
    method: 'GET',
    data: {
      ...params,
    },
  });
}
export async function getDataAnalysisBar(params) {
  return request('/api/v1/dataAnalysis/operates/histogram', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
export async function getDataAnalysisUserCount(params) {
  return request('/api/v1/dataAnalysis/userData/count', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
export async function getDataAnalysisSchoolCount(params) {
  return request('/api/v1/dataAnalysis/school/count', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
export async function getDataAnalysisPersonCount(params) {
  return request('/api/v1/dataAnalysis/person/count', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
