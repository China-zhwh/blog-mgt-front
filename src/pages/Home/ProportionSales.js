import React, { memo } from 'react';
import { Card } from 'antd';
// import { FormattedMessage } from 'umi/locale';
import styles from './HomeAnalysis.less';
import { Pie } from '@/components/Charts';

const ProportionSales = memo(({ loading, salesPieData }) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title="各类别教室统计"
    bodyStyle={{ padding: 24 }}
    style={{ marginTop: 1 }}
  >
    <Pie
      hasLegend
      subTitle="总间数"
      total={salesPieData.reduce((pre, now) => now.y + pre, 0)}
      data={salesPieData}
      height={304}
      lineWidth={4}
      style={{ padding: '8px 0' }}
    />
  </Card>
));

export default ProportionSales;
