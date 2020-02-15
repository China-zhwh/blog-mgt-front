import request from '@/utils/request';

/**
 * 尽量的简单，只负责中转传参数
 */

export default async function homeChartData() {
  return request('/api/homeChartData');
}
