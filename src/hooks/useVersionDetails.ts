import { useState, useEffect } from 'react';

interface VersionDetails {
    version: string;
    lastCommit: string;
}

export const useVersionDetails = () => {
    const [versionDetails, setVersionDetails] = useState<VersionDetails | null>(null);

    useEffect(() => {
        const fetchVersionDetails = async () => {
            try {
                const response = await fetch('/version-details.json');
                if (response.ok) {
                    const data = await response.json();
                    setVersionDetails(data);
                }
            } catch (error) {
                console.warn('Failed to fetch version details:', error);
            }
        };

        fetchVersionDetails();
    }, []);

    return versionDetails;
};
