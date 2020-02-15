import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './HomeAnalysis.less';
import PageLoading from '@/components/PageLoading';
import { AsyncLoadBizCharts } from '@/components/Charts/AsyncLoadBizCharts';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const SalesCard = React.lazy(() => import('./SalesCard'));
const ProportionSales = React.lazy(() => import('./ProportionSales'));
const OfflineData = React.lazy(() => import('./OfflineData'));

@connect(({ homeChart, loading }) => ({
  homeChart,
  loading: loading.effects['homeChart/fetch'],
}))
class HomeAnalysis extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'homeChart/fetch',
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'homeChart/clear',
    });
    cancelAnimationFrame(this.reqRef);
  }

  render() {
    const { homeChart, loading } = this.props;
    const { homeVisitData, homeSalesData, homeOfflineChartData, homeSalesTypeData } = homeChart;
    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} visitData={homeVisitData} />
        </Suspense>
        <div className={styles.twoColLayout}>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <SalesCard salesData={homeSalesData} loading={loading} />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales loading={loading} salesPieData={homeSalesTypeData} />
              </Suspense>
            </Col>
          </Row>
        </div>

        <Suspense fallback={null}>
          <OfflineData loading={loading} offlineChartData={homeOfflineChartData} />
        </Suspense>
      </GridContent>
    );
  }
}
// export default HomeAnalysis;
export default props => (
  <AsyncLoadBizCharts>
    <HomeAnalysis {...props} />
  </AsyncLoadBizCharts>
);
