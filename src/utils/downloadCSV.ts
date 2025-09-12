// utils/downloadCSV.ts
export function downloadCSV(
    data: any[],
    filename: string,
    fallbackHeaders: string[] = []
) {
    let headers: string[] = [];

    if (data && data.length > 0) {
        // Take keys from first row
        headers = Object.keys(data[0]);
    } else {
        headers = fallbackHeaders;
    }

    if (!headers || headers.length === 0) {
        throw new Error("No headers found for CSV export");
    }

    // Add header row
    let csvContent = headers.join(",") + "\n";

    if (data && data.length > 0) {
        data.forEach((row) => {
            const values = headers.map((h) => {
                const val = row[h];
                return val !== undefined && val !== null ? String(val).trim() : "";
            });
            csvContent += values.join(",") + "\n";
        });
    }

    // Add UTF-8 BOM for Hindi/Unicode support
    const utf8WithBom = "\uFEFF" + csvContent;

    const blob = new Blob([utf8WithBom], {
        type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
