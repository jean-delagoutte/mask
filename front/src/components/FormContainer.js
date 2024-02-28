import React from 'react';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { Card } from '@blueprintjs/core';

const FormContainer = ({ children }) => {
  return (
    <div style={{ margin: '5rem auto', width: '100%', maxWidth: '40rem' }}>
      <Card elevation={1} interactive={true} className="bp5-intent-primary bp5-padding-large">
        {children}
      </Card>
    </div>
  );
};

export default FormContainer;
