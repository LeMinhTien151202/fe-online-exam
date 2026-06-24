import React from 'react';
import ListeningForm from './forms/ListeningForm';
import ReadingForm from './forms/ReadingForm';
import GrammarForm from './forms/GrammarForm';
import SpeakingForm from './forms/SpeakingForm';
import WritingForm from './forms/WritingForm';

import { Form } from 'antd';

interface QuestionFormProps {
    form: any;
    skill: string;
    part: string;
    onSubmit: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ form, skill, part, onSubmit }) => {
    const renderContent = () => {
        const skillLower = skill.toLowerCase();
        switch (skillLower) {
            case 'listening': return <ListeningForm form={form} part={part} onSubmit={onSubmit} />;
            case 'reading': return <ReadingForm form={form} part={part} onSubmit={onSubmit} />;
            case 'grammar':
            case 'vocabulary':
            case 'grammar & vocabulary':
                return <GrammarForm form={form} part={part} onSubmit={onSubmit} />;
            case 'speaking': return <SpeakingForm form={form} part={part} onSubmit={onSubmit} />;
            case 'writing': return <WritingForm form={form} part={part} onSubmit={onSubmit} />;
            default: return <GrammarForm form={form} part={part} onSubmit={onSubmit} />;
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            preserve={true}
            style={{ width: '100%', height: '72vh', display: 'flex', flexDirection: 'column' }}
        >
            {renderContent()}
        </Form>
    );
};

export default QuestionForm;
