import React, { memo } from 'react';
import { Row, Col, Card, Tabs } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './HomeAnalysis.less';
import { Bar } from '@/components/Charts';

const { TabPane } = Tabs;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
    total: 323234,
  });
}

const SalesCard = memo(({ salesData, loading }) => (
  <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
    <div className={styles.salesCard}>
      <Tabs size="large" tabBarStyle={{ marginBottom: 24 }}>
        <TabPane tab="教师各职称人数统计" key="views">
          <Row>
            <Col xl={24} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar height={292} data={salesData} />
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  </Card>
));

export default SalesCard;
