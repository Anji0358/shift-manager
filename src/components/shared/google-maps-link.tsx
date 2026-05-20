import { ExternalLink, MapPin } from "lucide-react";
import { buildGoogleMapsSearchUrl } from "@/lib/google-maps";
import { Button } from "@/components/ui/button";

type GoogleMapsLinkProps = {
    query: string;
    label?: string;
};

export const GoogleMapsLink = ({
    query,
    label = "Google Mapsで開く",
}: GoogleMapsLinkProps) => {
    if (!query) {
        return null;
    }

    return (
        <Button
            asChild
            size="sm"
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-700 shadow-sm transition hover:bg-blue-100 hover:text-blue-800 active:scale-95"
        >
            <a
                href={buildGoogleMapsSearchUrl(query)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
            >
                <MapPin className="h-4 w-4 text-blue-600" />
                {label}
                <ExternalLink className="h-3 w-3 text-blue-500" />
            </a>
        </Button>
    );
};