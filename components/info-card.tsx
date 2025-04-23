import { Card, CardContent, CardTitle } from "@/components/ui/card";

export function InfoCard({
    title,
    isLoading,
    data,
    isError,
}: {
    title: string;
    isLoading: boolean;
    data: number | string | null;
    isError: boolean;
}) {
    return (
        <Card className="p-4">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {title}:
            </CardTitle>
            <CardContent className="flex flex-wrap items-start justify-start gap-2 px-0 pr-6">
                {isLoading ? (
                    <div className="skeleton-loader h-6 w-24 rounded bg-gray-300 dark:bg-gray-700"></div>
                ) : isError ? (
                    <p className="text-red-500 dark:text-red-400 text-sm">
                        Error loading data
                    </p>
                ) : (
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium break-words">
                        {data}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
