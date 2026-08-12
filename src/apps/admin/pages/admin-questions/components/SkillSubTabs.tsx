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
                    { key: 'part1', label: 'Part 1: Grammar (25 questions)' },
                    { key: 'part2', label: 'Part 2: Vocabulary (25 questions)' },
                ];
            case 'reading':
                return [
                    { key: 'part1', label: 'Part 1: Sentence Comprehension' },
                    { key: 'part2', label: 'Part 2: Text Cohesion' },
                    { key: 'part3', label: 'Part 3: Short Text' },
                    { key: 'part4', label: 'Part 4: Long Text' },
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
                    { key: 'part1', label: 'Part 1: Personal Information' },
                    { key: 'part2', label: 'Part 2: Describe & Opinion' },
                    { key: 'part3', label: 'Part 3: Compare & Contrast' },
                    { key: 'part4', label: 'Part 4: Abstract Topic' },
                ];
            case 'writing':
                return [
                    { key: 'part1', label: 'Part 1: Word-level Writing' },
                    { key: 'part2', label: 'Part 2: Short Text Writing' },
                    { key: 'part3', label: 'Part 3: Social Media Chat' },
                    { key: 'part4', label: 'Part 4: Contextual Emails' },
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
