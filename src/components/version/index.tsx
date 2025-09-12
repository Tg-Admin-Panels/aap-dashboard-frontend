import { useEffect, useState } from "react";
import packageInfo from "../../../package.json";

const VersionInfo: React.FC = () => {
    const [commitMessage, setCommitMessage] = useState<string | null>(null);

    useEffect(() => {
        fetch("/version-details.json")
            .then((response) => response.json())
            .then((data) => setCommitMessage(data.lastCommit))
            .catch(() => setCommitMessage(null));
    }, []);

    return (
        <div className="text-right mr-5 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 py-2">
                <div className="inline-block relative group cursor-help">
                    <span>Version {packageInfo.version}</span>

                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-pre-wrap max-w-md w-max">
                        <div className="font-semibold mb-1">
                            What's New in {packageInfo.version}:
                        </div>
                        {commitMessage
                            ? commitMessage.split("\n").map((line, i) => (
                                <div key={i} className="mb-1 text-left">
                                    {line}
                                </div>
                            ))
                            : "No changes recorded"}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default VersionInfo;
