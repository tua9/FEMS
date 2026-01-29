import React from 'react';

import DescriptionField from './DescriptionField';
import PhotoCaptureSection from './PhotoCaptureSection';

const IssueFormFields: React.FC = () => {
    return (
        <div className="grid md:grid-cols-2 gap-8">
            <DescriptionField />
            <PhotoCaptureSection />
        </div>
    );
};

export default IssueFormFields;