import React from 'react';

interface TableWrapperProps {
    children: React.ReactNode;
    className?: string;
}

const TableWrapper: React.FC<TableWrapperProps> = ({ children, className = '' }) => {
    return (
        <div className={`w-full overflow-x-auto rounded-lg ${className}`}>
            {children}
        </div>
    );
};

export default TableWrapper;
