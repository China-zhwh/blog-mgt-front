import React, { memo } from 'react';
import { Card } from 'antd';
import styles from './HomeAnalysis.less';
import { LineChart } from '@/components/Charts';

const OfflineData = memo(({ loading, offlineChartData }) => (
  <Card
    loading={loading}
    className={styles.offlineCard}
    bordered={false}
    style={{ marginTop: 32 }}
    title="各年级在校生人数统计"
  >
    <div style={{ padding: '0 24px' }}>
      <LineChart
        height={400}
        data={offlineChartData}
        titleMap={{
          y1: '男',
          y2: '女',
        }}
      />
    </div>
  </Card>
));

export default OfflineData;
