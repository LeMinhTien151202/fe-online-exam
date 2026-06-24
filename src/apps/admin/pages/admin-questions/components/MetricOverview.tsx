import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { ADMIN_COLORS } from '../../../constants';

const MetricOverview: React.FC = () => {
    return (
        <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col xs={12} sm={6}>
                <Card size="small" bordered={false}>
                    <Statistic title="Tổng số câu" value={145} valueStyle={{ fontSize: '18px', fontWeight: 700 }} />
                </Card>
            </Col>
            <Col xs={12} sm={6}>
                <Card size="small" bordered={false}>
                    <Statistic title="Đang sử dụng" value={120} valueStyle={{ fontSize: '18px', fontWeight: 700, color: ADMIN_COLORS.success }} />
                </Card>
            </Col>
            <Col xs={12} sm={6}>
                <Card size="small" bordered={false}>
                    <Statistic title="Bản nháp" value={25} valueStyle={{ fontSize: '18px', fontWeight: 700, color: ADMIN_COLORS.textSecondary }} />
                </Card>
            </Col>
            <Col xs={12} sm={6}>
                <Card size="small" bordered={false}>
                    <Statistic title="Tỷ lệ đúng TB" value="68.4%" valueStyle={{ fontSize: '18px', fontWeight: 700, color: ADMIN_COLORS.info }} />
                </Card>
            </Col>
        </Row>
    );
};

export default MetricOverview;
