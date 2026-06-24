import React from 'react';
import { Space, Button, Tag, Typography, TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const useExamColumns = (handleDeletePart: (key: string) => void, handleDeleteSet: (key: string) => void) => {
    const columnsPart: TableProps<any>['columns'] = [
        {
            title: 'TT',
            key: 'index',
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Tên bộ đề',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong style={{ color: '#1a365d' }}>{text}</Text>,
        },
        {
            title: 'Kỹ năng',
            dataIndex: 'skill',
            key: 'skill',
            render: (s: string) => {
                const colors: Record<string, string> = { Reading: 'blue', Grammar: 'orange', Writing: 'green', Listening: 'purple', Speaking: 'red' };
                return <Tag color={colors[s] || 'cyan'} style={{ borderRadius: '4px' }}>{s}</Tag>;
            },
        },
        {
            title: 'Số câu',
            dataIndex: 'questionCount',
            key: 'questionCount',
            align: 'center',
        },
        {
            title: 'Thời gian',
            dataIndex: 'duration',
            key: 'duration',
            render: (d: number) => <span>{d} phút</span>,
        },
        {
            title: 'Độ khó',
            dataIndex: 'difficulty',
            key: 'difficulty',
            render: (diff: string) => {
                const colors: Record<string, string> = { easy: 'success', medium: 'warning', hard: 'error' };
                const label: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
                return <Tag color={colors[diff]} style={{ borderRadius: '12px' }}>{label[diff]}</Tag>;
            },
        },
        {
            title: 'Lượt thi',
            dataIndex: 'tryCount',
            key: 'tryCount',
            align: 'center',
        },
        {
            title: 'Điểm số TB',
            dataIndex: 'avgScore',
            key: 'avgScore',
            render: (score: string) => <Text strong style={{ color: '#10b981' }}>{score}</Text>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <div className="custom-status-tag">
                    {status === 'active' ? 'Công khai' : 'Nháp'}
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            render: (record: any) => (
                <Space>
                    <Button className="action-btn" icon={<EyeOutlined />} />
                    <Button className="action-btn edit" icon={<EditOutlined />} />
                    <Button className="action-btn delete" icon={<DeleteOutlined />} onClick={() => handleDeletePart(record.key)} />
                </Space>
            ),
        },
    ];

    const columnsSet: TableProps<any>['columns'] = [
        {
            title: 'TT',
            key: 'index',
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Tên bộ đề',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong style={{ color: '#1a365d' }}>{text}</Text>,
        },
        {
            title: 'Kỹ năng',
            dataIndex: 'skill',
            key: 'skill',
            render: (s: string) => {
                const colors: Record<string, string> = { Reading: 'blue', Grammar: 'orange', Writing: 'green', Listening: 'purple', Speaking: 'red' };
                return <Tag color={colors[s] || 'cyan'} style={{ borderRadius: '4px' }}>{s}</Tag>;
            },
        },
        {
            title: 'Số phần',
            dataIndex: 'partCount',
            key: 'partCount',
            render: (count: number) => <span>{count} phần</span>,
        },
        {
            title: 'Số câu',
            dataIndex: 'questionCount',
            key: 'questionCount',
            align: 'center',
        },
        {
            title: 'Thời gian',
            dataIndex: 'duration',
            key: 'duration',
            render: (d: number) => <span>{d} phút</span>,
        },
        {
            title: 'Độ khó',
            dataIndex: 'difficulty',
            key: 'difficulty',
            render: (diff: string) => {
                const colors: Record<string, string> = { easy: 'success', medium: 'warning', hard: 'error' };
                const label: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
                return <Tag color={colors[diff]} style={{ borderRadius: '12px' }}>{label[diff]}</Tag>;
            },
        },
        {
            title: 'Lượt thi',
            dataIndex: 'tryCount',
            key: 'tryCount',
            align: 'center',
        },
        {
            title: 'Điểm số TB',
            dataIndex: 'avgScore',
            key: 'avgScore',
            render: (score: string) => <Text strong style={{ color: '#10b981' }}>{score}</Text>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <div className="custom-status-tag">
                    {status === 'active' ? 'Công khai' : 'Nháp'}
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            render: (record: any) => (
                <Space>
                    <Button className="action-btn" icon={<EyeOutlined />} />
                    <Button className="action-btn edit" icon={<EditOutlined />} />
                    <Button className="action-btn delete" icon={<DeleteOutlined />} onClick={() => handleDeleteSet(record.key)} />
                </Space>
            ),
        },
    ];

    const columnsFull: TableProps<any>['columns'] = [
        {
            title: 'TT',
            key: 'index',
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Tên đề thi thử',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong style={{ color: '#1a365d' }}>{text}</Text>,
        },
        {
            title: 'Cấu trúc bài thi',
            dataIndex: 'skills',
            key: 'skills',
            render: (skills: string[]) => (
                <Space wrap>
                    {skills.map(s => <Tag key={s} color="blue" style={{ fontSize: '11px', borderRadius: '4px' }}>{s}</Tag>)}
                </Space>
            ),
        },
        {
            title: 'Thời lượng',
            dataIndex: 'duration',
            key: 'duration',
            render: (d: number) => <Text strong>{d} phút</Text>,
        },
        {
            title: 'Lượt thi',
            dataIndex: 'tryCount',
            key: 'tryCount',
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <div className="custom-status-tag">
                    {status === 'active' ? 'Công khai' : 'Nháp'}
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            render: () => (
                <Space>
                    <Button className="action-btn" icon={<EyeOutlined />} />
                    <Button className="action-btn edit" icon={<EditOutlined />} />
                    <Button className="action-btn delete" icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    return { columnsPart, columnsSet, columnsFull };
};
