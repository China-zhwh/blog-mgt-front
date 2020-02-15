import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import numeral from 'numeral';
import styles from './HomeAnalysis.less';
import { ChartCard, MiniArea } from '@/components/Charts';
import Trend from '@/components/Trend';
// import Yuan from '@/utils/Yuan';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = memo(({ loading, visitData }) => (
  <Row gutter={24}>
    {/* 性别 统计 */}
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="全校在校生总人数"
        action={
          <Tooltip title="全校在校生总人数">
            <Icon type="info-circle-o" />
          </Tooltip>
        } //按钮选项
        loading={loading}
        total={numeral(8846).format('0,0')}
        contentHeight={46}
      >
        <Trend flag="" style={{ marginRight: 16 }}>
          {'男生'}
          <span className={styles.trendText}>800</span>
        </Trend>
        <Trend flag="">
          {'女生'}
          <span className={styles.trendText}>1200</span>
        </Trend>
      </ChartCard>
    </Col>

    {/* 全校教职工总人数 */}
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="全校教职工总人数"
        action={
          <Tooltip title="全校教职工总人数">
            <Icon type="info-circle-o" />
          </Tooltip>
        } //按钮选项
        loading={loading}
        total={numeral(2560).format('0,0')}
        contentHeight={46}
      >
        <Trend flag="" style={{ marginRight: 16 }}>
          {'男生'}
          <span className={styles.trendText}>800</span>
        </Trend>
        <Trend flag="">
          {'女生'}
          <span className={styles.trendText}>1200</span>
        </Trend>
      </ChartCard>
    </Col>

    {/* 学生访问量统计 */}
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="今日学生登录人数"
        action={
          <Tooltip title="今日学生登录人数">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(8846).format('0,0')}
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={visitData} />
      </ChartCard>
    </Col>
    {/* 教室访问量统计 */}
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="今日教师登录人数"
        action={
          <Tooltip title="今日教师登录人数">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(8846).format('0,0')}
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={visitData} />
      </ChartCard>
    </Col>
  </Row>
));

export default IntroduceRow;
