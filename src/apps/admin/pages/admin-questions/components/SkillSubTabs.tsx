import React from 'react';
import { Tabs } from 'antd';

interface SkillSubTabsProps {
    skill: string;
    activePart: string;
    onChange: (key: string) => void;
}

const SkillSubTabs: React.FC<SkillSubTabsProps> = ({ skill, activePart, onChange }) => {
    const getItems = () => {
        switch (skill.toLowerCase()) {
            case 'grammar':
            case 'vocabulary':
                return [
                    { key: 'part1', label: 'Part 1: Grammar (25 câu)' },
                    { key: 'part2', label: 'Part 2: Vocabulary (25 câu)' },
                ];
            case 'reading':
                return [
                    { key: 'part1', label: 'Phần 1: Sentence Comprehension' },
                    { key: 'part2', label: 'Phần 2: Text Cohesion' },
                    { key: 'part3', label: 'Phần 3: Short Text' },
                    { key: 'part4', label: 'Phần 4: Long Text' },
                ];
            case 'listening':
                return [
                    { key: 'part1', label: 'Part 1: Information Recognition' },
                    { key: 'part2', label: 'Part 2: Information Matching' },
                    { key: 'part3', label: 'Part 3: Opinion Matching' },
                    { key: 'part4', label: 'Part 4: Monologue Comprehension' },
                ];
            case 'speaking':
                return [
                    { key: 'part1', label: 'Phần 1: Personal Information' },
                    { key: 'part2', label: 'Phần 2: Mô tả hình ảnh' },
                    { key: 'part3', label: 'Phần 3: Trả lời câu hỏi chủ đề' },
                    { key: 'part4', label: 'Phần 4: Thảo luận tình huống' },
                ];
            case 'writing':
                return [
                    { key: 'part1', label: 'Phần 1: Điền form' },
                    { key: 'part2', label: 'Phần 2: Tin nhắn/Note ngắn' },
                    { key: 'part3', label: 'Phần 3: Viết đoạn văn xã hội' },
                    { key: 'part4', label: 'Phần 4: Viết email phản hồi' },
                ];
            default:
                return [];
        }
    };

    return (
        <Tabs
            type="card"
            activeKey={activePart}
            onChange={onChange}
            items={getItems()}
            className="mb-4"
        />
    );
};

export default SkillSubTabs;
